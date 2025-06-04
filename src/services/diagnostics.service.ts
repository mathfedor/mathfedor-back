import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Diagnostic } from '../models/schemas/diagnostic.schema';
import { DiagnosticsResult } from '../models/schemas/diagnostics-result.schema';
import { CreateDiagnosticDto } from '../models/dtos/create-diagnostic.dto';
import { CreateDiagnosticsResultDto } from '../models/dtos/create-diagnostics-result.dto';
import * as XLSX from 'xlsx';

@Injectable()
export class DiagnosticsService {
  constructor(
    @InjectModel(Diagnostic.name) private diagnosticModel: Model<Diagnostic>,
    @InjectModel(DiagnosticsResult.name) private diagnosticsResultModel: Model<DiagnosticsResult>,
  ) { }

  async create(createDiagnosticDto: CreateDiagnosticDto, file: Express.Multer.File, userId: string) {
    // Convertir el archivo Excel a JSON
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const data = {};

    // Primero leer la hoja Menú para obtener la lista de hojas
    if (!workbook.Sheets['Menú']) {
      throw new Error('La hoja Menú no se encuentra en el archivo Excel');
    }

    const menuSheet = workbook.Sheets['Menú'];
    const menuData = XLSX.utils.sheet_to_json(menuSheet, { header: 1 });


    // Buscar la fila que contiene "Temas"
    let temasIndex = -1;
    for (let i = 0; i < menuData.length; i++) {
      const row = menuData[i];
      if (Array.isArray(row) && row.includes('Temas')) {
        temasIndex = i;
        break;
      }
    }

    if (temasIndex === -1) {
      throw new Error('No se encontró la palabra "Temas" en la hoja Menú');
    }

    // Estructura para almacenar los temas y sus ejercicios
    const topics = [];
    const requiredSheets = [];

    // Extraer los temas y sus hojas correspondientes
    for (let i = temasIndex + 1; i < menuData.length; i++) {
      const row = menuData[i];
      if (Array.isArray(row) && row[0]) {
        const sheetName = row[0].toString().trim();
        const topicName = row[1]?.toString().trim() || '';

        if (sheetName) {
          // Agregar la hoja a la lista de hojas requeridas
          requiredSheets.push(sheetName);

          // Si hay un nombre de tema, crear el tema
          if (topicName) {
            // Verificar si el tema ya existe en la lista
            const existingTopic = topics.find(topic => topic.title === topicName);

            // Si existe, son ejercicios de un tema, si no existe, es un tema nuevo
            if (!existingTopic) {
              topics.push({
                title: topicName,
                image: '',
                completed: false,
                duration: '',
                description: '',
                exercises: []
              });
            }
          }
        }
      }
    }

    // Agregar 'AYUDA' a la lista de hojas requeridas
    requiredSheets.push('AYUDA');

    // Procesar cada par de hojas (explicación y ejercicios)
    for (let i = 0; i < requiredSheets.length - 1; i += 2) {
      const explanationSheet = requiredSheets[i];
      const exercisesSheet = requiredSheets[i + 1];

      if (workbook.Sheets[explanationSheet] && workbook.Sheets[exercisesSheet]) {
        // Leer la hoja de explicación
        const explanationData = XLSX.utils.sheet_to_json(workbook.Sheets[explanationSheet]);

        // Convertir todo el contenido de la hoja a string para la descripción
        const description = explanationData
          .map(row => Object.values(row).join(' '))
          .join('\n')
          .trim();

        // Leer la hoja de ejercicios
        const exercisesData = XLSX.utils.sheet_to_json(workbook.Sheets[exercisesSheet]).slice(3);
        console.log('********** Últimas 10 filas de exercisesData **********', exercisesData.slice(-10));

        const exercises = exercisesData
          .filter(row => {
            /*  // Verificar si la fila solo tiene __EMPTY_1
             const keys = Object.keys(row);
             console.log('********** keys **********', keys);
             const hasOnlyEmpty1 = keys.length === 1 && keys[0] === '__EMPTY_1';*/

            return row['__EMPTY_1'] && row['__EMPTY_1'].trim() !== '';
          })
          .map(exercise => {
            // Determinar el formato de las opciones
            const options = exercise['__EMPTY_6']
              ? [
                exercise['__EMPTY_3'] || '',
                exercise['__EMPTY_4'] || '',
                exercise['__EMPTY_5'] || '',
                exercise['__EMPTY_6'] || ''
              ]
              : [
                exercise['__EMPTY_2'] || '',
                exercise['__EMPTY_3'] || '',
                exercise['__EMPTY_4'] || '',
                exercise['__EMPTY_5'] || ''
              ];

            if (!exercise['__EMPTY_32'] && !exercise['__EMPTY_17']) {
              console.log('********** exercise sin respuesta correcta **********', exercise);
            }

            return {
              statement: exercise['__EMPTY_1'] || '',
              options: options,
              correctAnswer: exercise['__EMPTY_32'] || exercise['__EMPTY_17'] || ''
            };
          });

        // Actualizar el tema correspondiente
        const topicIndex = Math.floor(i / 2);
        if (topics[topicIndex]) {
          topics[topicIndex].description = description;
          topics[topicIndex].exercises = exercises;
        }

        // Guardar los datos en el objeto data para referencia
        data[explanationSheet] = explanationData;
        data[exercisesSheet] = exercisesData;
      } else {
        console.warn(`No se encontraron las hojas ${explanationSheet} o ${exercisesSheet}`);
      }
    }

    // Agregar la hoja AYUDA a los datos
    if (workbook.Sheets['AYUDA']) {
      data['AYUDA'] = XLSX.utils.sheet_to_json(workbook.Sheets['AYUDA']);
    }

    const diagnostic = new this.diagnosticModel({
      ...createDiagnosticDto,
      topics: topics,
      data,
      createdBy: userId,
    });

    return diagnostic.save();
  }

  async findAll() {
    return this.diagnosticModel.find().exec();
  }

  async findOne(id: string) {
    return this.diagnosticModel.findById(id).exec();
  }

  async createResult(createDiagnosticsResultDto: CreateDiagnosticsResultDto) {
    const result = new this.diagnosticsResultModel(createDiagnosticsResultDto);
    return result.save();
  }
} 