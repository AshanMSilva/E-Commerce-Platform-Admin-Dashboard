import { Product } from './product';

export class Category{
    _id: number;
    name: string;
    image: string;
    subCategories: Category[];
    products:Product[];
    topCategory: boolean;
    sales:Number;
}