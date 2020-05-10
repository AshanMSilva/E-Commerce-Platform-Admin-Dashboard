import { Customer } from './customer';
import { Item } from './cartItem';

export class GuestCustomer extends Customer{
    cart: Item[];
}