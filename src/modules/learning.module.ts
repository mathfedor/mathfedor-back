import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LearningController } from '../controllers/learning/learning.controller';
import { LearningService } from '../services/learning.service';
import { Learning, LearningSchema } from '../models/schemas/learning.schema';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { PurchasesModule } from './purchases.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Learning.name, schema: LearningSchema }]),
    ConfigModule,
    forwardRef(() => PurchasesModule),
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [LearningController],
  providers: [LearningService, AuthGuard],
  exports: [LearningService]
})
export class LearningModule {} 