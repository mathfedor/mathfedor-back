import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiagnosticsService } from '../services/diagnostics.service';
import { DiagnosticsController } from '../controllers/diagnostics/diagnostics.controller';
import { Diagnostic, DiagnosticSchema } from '../models/schemas/diagnostic.schema';
import { DiagnosticsResult, DiagnosticsResultSchema } from '../models/schemas/diagnostics-result.schema';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Diagnostic.name, schema: DiagnosticSchema },
      { name: DiagnosticsResult.name, schema: DiagnosticsResultSchema },
    ]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DiagnosticsController],
  providers: [DiagnosticsService, AuthGuard],
  exports: [DiagnosticsService],
})
export class DiagnosticsModule {} 