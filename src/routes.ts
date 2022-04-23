import { Router, Request, Response } from 'express';
import { GetAllProductsController } from './controllers/GetAllProductsController';
import { MakePDFService } from './services/PDFMakeService';


const routes = Router();

routes.get("/products", new GetAllProductsController().handle);

routes.get("/products/downloadpdf", new MakePDFService().handle);

export { routes };