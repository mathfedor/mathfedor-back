import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Learning } from '../models/schemas/learning.schema';
import { CreateLearningDto } from '../models/dtos/learning.dto';

@Injectable()
export class LearningService {
  constructor(
    @InjectModel(Learning.name) private learningModel: Model<Learning>,
  ) { }

  async create(createLearningDto: CreateLearningDto): Promise<Learning> {
    // Verificar si ya existe un learning con el mismo grupo
    const existingLearning = await this.learningModel.findOne({ group: createLearningDto.group });
    if (existingLearning) {
      throw new Error(`Ya existe un learning con el grupo: ${createLearningDto.group}`);
    }

    const createdLearning = new this.learningModel(createLearningDto);
    createdLearning.price = Number(createLearningDto.price);
    return createdLearning.save();
  }

  async findAll(): Promise<Learning[]> {
    return this.learningModel.find().exec();
  }

  async findOne(id: string): Promise<Learning> {
    return this.learningModel.findById(id).exec();
  }

  async findByGroup(group: string): Promise<Learning[]> {
    return this.learningModel.find({ group }).exec();
  }

  async findActiveLearnings(): Promise<Partial<Learning>[]> {
    return this.learningModel.find(
      { status: 'active' },
      { title: 1, description: 1, price: 1, image: 1, group: 1, _id: 1, tags: 1 }
    ).exec();
  }
} 