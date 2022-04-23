import { Request, Response } from 'express';
import { GetAllProductsservice } from '../services/GetAllProductsService';

export class GetAllProductsController {
    async handle(request: Request, response: Response) {

        const service = new GetAllProductsservice();

        const products = await service.execute();

        return response.json(products);
    }
}