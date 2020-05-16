import { Customer } from './customer';
import { Address } from './address';
import { Order } from './order';
import { Product } from './product';
import { Item } from './cartItem';

export class RegisteredCustomer extends Customer{
    email: string;
    password: string;
    addresses:Address[];
    contactNumbers: string[];
    orders: Order[];
    wishlist: Product[];
    cart: Item[];
    cardNumbers: string[];
    image:string;
}