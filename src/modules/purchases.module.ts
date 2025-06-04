import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchasesController } from '../controllers/purchases/purchases.controller';
import { PurchasesService } from '../services/purchases.service';
import { Purchase, PurchaseSchema } from '../models/schemas/purchase.schema';
import { Learning, LearningSchema } from '../models/schemas/learning.schema';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { LearningModule } from './learning.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Purchase.name, schema: PurchaseSchema },
            { name: Learning.name, schema: LearningSchema }
        ]),
        ConfigModule,
        forwardRef(() => LearningModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [PurchasesController],
    providers: [PurchasesService, AuthGuard],
    exports: [PurchasesService]
})
export class PurchasesModule { } 