import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePurchaseDto } from '../models/dtos/purchase.dto';
import { Purchase } from '../models/schemas/purchase.schema';
import { Learning } from '../models/schemas/learning.schema';

@Injectable()
export class PurchasesService {
    constructor(
        @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
        @InjectModel(Learning.name) private learningModel: Model<Learning>
    ) {}

    async create(createPurchaseDto: CreatePurchaseDto) {
        try {
            const createdPurchase = new this.purchaseModel(createPurchaseDto);
            const savedPurchase = await createdPurchase.save();
            
            return {
                message: 'Compra creada exitosamente',
                data: savedPurchase
            };
        } catch (error) {
            throw new Error(`Error al crear la compra: ${error.message}`);
        }
    }

    async hasAccessToModule(userId: string, moduleId: string): Promise<boolean> {
        try {
            const purchase = await this.purchaseModel.findOne({
                user_id: userId,
                module_id: moduleId,
                'transaction.status': 'APPROVED' // Asumiendo que solo las compras aprobadas dan acceso
            });

            return !!purchase;
        } catch (error) {
            throw new Error(`Error al verificar acceso al módulo: ${error.message}`);
        }
    }

    async getUserPurchases(userId: string) {
        try {
            const purchases = await this.purchaseModel.find({ 
                user_id: userId,
                'transaction.status': 'APPROVED'
            }).sort({ purchase_date: -1 });


            return {
                message: 'Compras obtenidas exitosamente',
                data: purchases
            };
        } catch (error) {
            throw new Error(`Error al obtener las compras del usuario: ${error.message}`);
        }
    }

    async getUserPurchasesWithModule(userId: string) {
        try {
            const purchases = await this.purchaseModel.find({ 
                user_id: userId,
                'transaction.status': 'APPROVED'
            }).sort({ purchase_date: -1 });

            // Obtener la información de los módulos para cada compra
            const purchasesModule = await Promise.all(
                purchases.map(async (purchase) => {
                    const module = await this.learningModel.findById(purchase.module_id);
                    return {
                        module_id: purchase.module_id,
                        title: module?.title || 'Módulo no encontrado',
                        purchaseDate: purchase.purchase_date
                    };
                })
            );

            return {
                message: 'Compras obtenidas exitosamente',
                data: purchasesModule
            };
        } catch (error) {
            throw new Error(`Error al obtener las compras del usuario: ${error.message}`);
        }
    }
} 