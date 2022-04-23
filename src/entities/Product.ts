import { Entity, Column, PrimaryColumn } from 'typeorm';


@Entity("products")
export class Products {

    @PrimaryColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    quantity: number;

}