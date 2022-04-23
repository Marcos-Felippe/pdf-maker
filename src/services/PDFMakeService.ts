import { Request, Response } from 'express';
import { GetAllProductsservice } from '../services/GetAllProductsService';

import PDFPrinter from 'pdfmake';
import { TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';

//import fs from 'fs';

export class MakePDFService {
    async handle(request: Request, response: Response) {

        const service = new GetAllProductsservice();
        const products = await service.execute();
        
        // - Necessaria a criação das fontes que vão ser utilizadas
        const fonts = {
            Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'
            }
        };
        
        const printer = new PDFPrinter(fonts);


        const body = [];

        // - Pegando o conteudo dos titulos, inserindo no array columnsBody e e inserindo no array body
        const columnsTitle: TableCell[] = [
            { text: 'ID', style: "id" },
            { text: 'Descrição', style: "columnsTitle" },
            { text: 'Preço', style: "columnsTitle" },
            { text: 'Quantidade', style: "columnsTitle" },
        ];

        const columnsBody = new Array();

        columnsTitle.forEach(column => columnsBody.push(column));
        body.push(columnsBody);

        // - Extraindo o conteudo dos produtos e inserindo no array body
        for await (let product of products) {
            const rows = new Array();
            rows.push({ text: product.id, style: "fields" });
            rows.push({ text: product.description, style: "fields" });
            rows.push({ text: `R$ ${product.price}`, style: "fields" });
            rows.push({ text: product.quantity, style: "fields" });

            body.push(rows);
        }


        // - Criando a estilização do pdf e o conteudo
        const docDefinitions: TDocumentDefinitions = {
            defaultStyle: { font: "Helvetica" },
            content: [
                {
                    columns: [
                        { text: 'Relatório de Produtos', style: "header"},
                        { text: '01/02/2022  11:00hrs\n\n\n\n' , style: "subheader"},
                    ]
                },
                {
                    table: {
                        heights: function (row) {
                            return 30;
                        },
                        widths: [50, 200, 80, 80],
                        body
                    },
                },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: "center"
                },
                subheader: {
                    fontSize: 12,
                    bold: true,
                    alignment: "center"
                },
                columnsTitle: {
                    fontSize: 12,
                    bold: true,
                    fillColor: "#1e90ff",
                    color: "#fff",
                    alignment: "center",
                    margin: 4
                },
                id: {
                    fontSize: 12,
                    bold: true,
                    fillColor: "#999",
                    color: "#fff",
                    alignment: "center",
                    margin: 4,
                },
                fields: {
                    fontSize: 12,
                    bold: false,
                    color: "#000",
                    alignment: "center",
                    margin: 4,
                },
            }
        };


        const pdfdoc = printer.createPdfKitDocument(docDefinitions);

        // - Pega o conteudo gerado e passa para um outro arquivo, neste caso um pdf:
        //pdfdoc.pipe(fs.createWriteStream("Relatorio.pdf"));

        // - Para configurar a visualização de pdf do browser:
        //Vamos pegar cada chunk e colocar em um array
        const chunks = [];

        pdfdoc.on("data", (chunk) => {
            chunks.push(chunk);
        });

        pdfdoc.end();

        //Após terminar vamos concatenar os chunks para torna-lo legivel ao browser
        //Vai converter o array tipo N para um tipo Buffer
        pdfdoc.on("end", () => {
            const result = Buffer.concat(chunks);
            response.end(result);
        });
    }
    
}


