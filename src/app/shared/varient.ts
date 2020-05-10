import { Attribute } from './attribute';

export class Varient{
    id: string;
    name: string;
    price: number;
    image: string;
    availability: number;
    attributes:Attribute[];
    sales: number;

}