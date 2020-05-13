import { Address } from './address';
import { Item } from './cartItem';
import { PaymentDetails } from './paymentDetails';

export class Order{
    _id: string;
    orderItems: Item[];
    cost: number;
    status: string;
    orderedDate: string;
    expireDate: string;
    deliveryAddress: Address;
    paymentDetails: PaymentDetails;

}