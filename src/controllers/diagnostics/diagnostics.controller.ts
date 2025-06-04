import { Controller, Post, Get, Body, UseGuards, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DiagnosticsService } from '../../services/diagnostics.service';
import { CreateDiagnosticDto } from '../../models/dtos/create-diagnostic.dto';
import { CreateDiagnosticsResultDto } from '../../models/dtos/create-diagnostics-result.dto';
import { AuthGuard } from '../../modules/auth.guard';

@Controller('diagnostics')
@UseGuards(AuthGuard)
export class DiagnosticsController {
  constructor(private readonly diagnosticsService: DiagnosticsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createDiagnosticDto: CreateDiagnosticDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.diagnosticsService.create(createDiagnosticDto, file, createDiagnosticDto.createdBy);
  }

  @Get()
  async findAll() {
    return this.diagnosticsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.diagnosticsService.findOne(id);
  }

  @Post('results')
  async createResult(@Body() createDiagnosticsResultDto: CreateDiagnosticsResultDto) {
    return this.diagnosticsService.createResult(createDiagnosticsResultDto);
  }
} 