import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
import { UsersModule } from './modules/users.module';
import { DiagnosticsModule } from './modules/diagnostics.module';
import { MathChatModule } from './modules/math-chat.module';
import { LearningModule } from './modules/learning.module';
import { PurchasesModule } from './modules/purchases.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    UsersModule,
    DiagnosticsModule,
    MathChatModule,
    LearningModule,
    PurchasesModule
  ]
})
export class AppModule {} 