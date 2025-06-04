import { BadRequestException, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors, Body, UsePipes, ValidationPipe, Param, Res, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { AuthGuard } from '../../modules/auth.guard';
import { LearningService } from '../../services/learning.service';
import { PurchasesService } from '../../services/purchases.service';
import { CreateLearningDto, InputAnswerDto } from '../../models/dtos/learning.dto';
import { Topic, Exercise } from '../../interfaces/learning.interface';
import { Response } from 'express';
import { UsersService } from '../../services/users.service';

@Controller('learning')
export class LearningController {
    constructor(
        private readonly learningService: LearningService,
        @Inject(forwardRef(() => PurchasesService))
        private readonly purchasesService: PurchasesService,
        private readonly usersService: UsersService
    ) { }

    @Post('upload')
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    file.mimetype === 'application/vnd.ms-excel') {
                    cb(null, true);
                } else {
                    cb(new Error('Solo se permiten archivos Excel'), false);
                }
            },
        }),
    )
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() createLearningDto: CreateLearningDto
    ) {
        try {
            const workbook = XLSX.readFile(file.path);

            // Verificar que existan las hojas requeridas
            if (!workbook.SheetNames.includes('Topics') || !workbook.SheetNames.includes('Exercises')) {
                throw new BadRequestException('El archivo Excel debe contener las hojas "Topics" y "Exercises"');
            }

            // Leer la hoja Topics
            const topicsSheet = workbook.Sheets['Topics'];
            const topicsData = XLSX.utils.sheet_to_json(topicsSheet) as Topic[];

            // Leer la hoja Exercises
            const exercisesSheet = workbook.Sheets['Exercises'];
            const exercisesData = XLSX.utils.sheet_to_json(exercisesSheet) as Exercise[];

            // Agrupar descripciones por sheet y obtener títulos
            const topicsBySheet = topicsData.reduce((acc, row) => {
                const sheet = String(row['sheet']).trim(); // Convertir a string y eliminar espacios
                if (!acc[sheet]) {
                    // Encontrar la primera fila de este sheet
                    const firstRowOfSheet = topicsData.find(r => String(r['sheet']).trim() === sheet);
                    acc[sheet] = {
                        title: String(firstRowOfSheet?.['title']), // Obtener el título de la primera fila de este sheet
                        description: '',
                        duration: createLearningDto.duration,
                        completed: false,
                        image: '',
                        sheet: sheet,
                        exampleExercises: [],
                        exercises: []
                    };
                }

                // Procesar ejercicios de ejemplo si existen
                if (row['example_exercises']) {
                    try {
                        const exampleExercises = {
                            values: row['example_exercises']
                        };
                        acc[sheet].exampleExercises.push(exampleExercises);

                    } catch (error) {
                        console.error(`Error al procesar ejercicios de ejemplo para sheet ${sheet}:`, error);
                        console.error('Contenido de la celda:', row['example_exercises']);
                    }
                }

                // Concatenar descripciones con separador
                if (row['description']) {
                    if (acc[sheet].description) {
                        // Solo agregar el separador si hay ejercicios de ejemplo en esta fila
                        if (row['example_exercises']) {
                            acc[sheet].description += ' ||| ';
                        } else {
                            acc[sheet].description += ' ';
                        }
                    }
                    acc[sheet].description += row['description'];
                }

                // Procesar imagen
                if (row['image']) {
                    acc[sheet].image = row['image']
                        .replace('{img_', '')
                        .replace('}', '.png');
                }

                return acc;
            }, {});

            // Convertir el objeto agrupado a array
            createLearningDto.topics = Object.values(topicsBySheet);

            // Procesar hoja Exercises
            if (workbook.SheetNames.includes('Exercises')) {
                const exercisesSheet = workbook.Sheets['Exercises'];
                const exercisesData = XLSX.utils.sheet_to_json(exercisesSheet);

                // Agrupar ejercicios por sheet
                exercisesData.forEach(row => {
                    const sheet = String(row['sheet']).trim(); // Convertir a string y eliminar espacios
                    const topic = createLearningDto.topics.find(t => t.sheet === sheet);

                    if (topic) {
                        // Procesar las opciones usando el separador punto y coma
                        const options = row['options']
                            ? String(row['options']).split(';').map(opt => opt.trim())
                            : [];

                        const exercise = {
                            statement: row['statement'],
                            options: options,
                            correctAnswer: row['correctAnswer'],
                            type: row['type'],
                            image: row['image'] ? row['image'].replace('{img_', '').replace('}', '.png') : ''
                        };

                        topic.exercises.push(exercise);
                    }
                });
            }
        } catch (error) {
            throw new BadRequestException(`Error al procesar el archivo: ${error.message}`);
        }

        createLearningDto.status = 'active';
        const learning = await this.learningService.create(createLearningDto);
        return {
            message: 'Archivo procesado correctamente',
            data: learning
        };
    }

    @Get()
    @UseGuards(AuthGuard)
    async findAll() {
        return this.learningService.findAll();
    }

    @Get('getlearnings')
    async findActiveLearnings() {
        return this.learningService.findActiveLearnings();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async findOne(@Param('id') id: string) {
        return this.learningService.findOne(id);
    }

    @Get('group/:group')
    @UseGuards(AuthGuard)
    async findByGroup(@Param('group') group: string) {
        return this.learningService.findByGroup(group);
    }

    @Get('download/:moduleId/:userId')
    @UseGuards(AuthGuard)
    async downloadExcel(
        @Param('moduleId') moduleId: string,
        @Param('userId') userId: string,
        @Res() res: Response
    ) {
        try {
            // Verificar si el usuario tiene acceso al módulo
            const hasAccess = await this.purchasesService.hasAccessToModule(userId, moduleId);
            
            if (!hasAccess) {
                throw new UnauthorizedException('No tienes acceso a este módulo');
            }

            // Obtener la información del módulo
            const module = await this.learningService.findOne(moduleId);
            
            if (!module) {
                throw new BadRequestException('Módulo no encontrado');
            }

            // Obtener información del usuario
            const user = await this.usersService.findOneById(userId);
            if (!user) {
                throw new BadRequestException('Usuario no encontrado');
            }

            // Determinar el archivo a descargar según el grupo
            let excelFileName = '';
            switch (module.group) {
                case 'Grado11':
                    excelFileName = 'Matemática-Digital-Interactiva-11-DESCARGA.xlsx';
                    break;
                case 'Modulo1':
                    excelFileName = 'Modulo1.xlsx';
                    break;
                case 'Modulo2':
                    excelFileName = 'Modulo2.xlsx';
                    break;
                case 'Modulo3':
                    excelFileName = 'Modulo3.xlsx';
                    break;
                case 'Modulo4':
                    excelFileName = 'Modulo4.xlsx';
                    break;
                case 'Modulo5':
                    excelFileName = 'Modulo5.xlsx';
                    break;
                default:
                    throw new BadRequestException('Grupo no soportado para descarga');
            }

            // Leer el archivo Excel existente
            const excelPath = join(process.cwd(), 'src', 'excelfiles', excelFileName);
            return res.download(excelPath, excelFileName);

        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new BadRequestException(`Error al generar el archivo Excel: ${error.message}`);
        }
    }
} 