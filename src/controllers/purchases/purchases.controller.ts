import { Controller, Post, Body, UseGuards, UsePipes, ValidationPipe, Get, Query, Param } from '@nestjs/common';
import { AuthGuard } from '../../modules/auth.guard';
import { CreatePurchaseDto } from '../../models/dtos/purchase.dto';
import { PurchasesService } from '../../services/purchases.service';

@Controller('purchases')
export class PurchasesController {
    constructor(private readonly purchasesService: PurchasesService) { }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async createPurchase(@Body() createPurchaseDto: CreatePurchaseDto) {
        try {
            return await this.purchasesService.create(createPurchaseDto);
        } catch (error) {
            throw new Error(`Error al procesar la compra: ${error.message}`);
        }
    }

    @Get('access')
    @UseGuards(AuthGuard)
    async hasAccessToModule(
        @Query('userId') userId: string,
        @Query('moduleId') moduleId: string
    ) {
        try {
            const hasAccess = await this.purchasesService.hasAccessToModule(userId, moduleId);
            return {
                hasAccess,
                message: hasAccess ? 'El usuario tiene acceso al módulo' : 'El usuario no tiene acceso al módulo'
            };
        } catch (error) {
            throw new Error(`Error al verificar acceso: ${error.message}`);
        }
    }

    @Get('user/:userId')
    @UseGuards(AuthGuard)
    async getUserPurchases(@Param('userId') userId: string) {
        try {
            return await this.purchasesService.getUserPurchases(userId);
        } catch (error) {
            throw new Error(`Error al obtener las compras del usuario: ${error.message}`);
        }
    }

    @Get('books/:userId')
    @UseGuards(AuthGuard)
    async getUserPurchasesWithModule(@Param('userId') userId: string) {
        try {
            return await this.purchasesService.getUserPurchasesWithModule(userId);
        } catch (error) {
            throw new Error(`Error al obtener las compras del usuario: ${error.message}`);
        }
    }
} 