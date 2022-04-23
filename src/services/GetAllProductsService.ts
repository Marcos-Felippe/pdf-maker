import { getRepository } from 'typeorm';
import { Products } from '../entities/Product';

export class GetAllProductsservice {
    async execute() {
        const repo = getRepository(Products);

        const products = await repo.find();

        return products;
    }
    
}