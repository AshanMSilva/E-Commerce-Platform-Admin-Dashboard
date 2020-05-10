import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHttpmsgService } from '../processHttpmsgService/process-httpmsg.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseURL } from 'src/app/shared/baseurl';
// import { Customer } from 'src/app/shared/customer';
import { RegisteredCustomer } from 'src/app/shared/registeredCustomer';
import { Address } from 'src/app/shared/address';
import { Item } from 'src/app/shared/cartItem';
import { Order } from 'src/app/shared/order';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient, private processHTTPMsgService : ProcessHttpmsgService) { }

  getUsers():Observable<RegisteredCustomer[]>{
    return this.http.get<RegisteredCustomer[]>(baseURL+'users').pipe(catchError(this.processHTTPMsgService.handleError));
    
  }
  getUserById(id: string): Observable<RegisteredCustomer>{
    return this.http.get<RegisteredCustomer>(baseURL+'users/'+id).pipe(catchError(this.processHTTPMsgService.handleError));
   
  }
  
  updateUser(user:RegisteredCustomer): Observable<RegisteredCustomer>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

    return this.http.put<RegisteredCustomer>(baseURL +'users/'+user.id, user, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  addNewUser(user: RegisteredCustomer):Observable<RegisteredCustomer>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<RegisteredCustomer>(baseURL+ 'users', user, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  addNewAddress(id:number, address: Address):Observable<RegisteredCustomer>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<RegisteredCustomer>(baseURL+ 'users/'+ id+'/addresses', address, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  updateAddress(address: Address, userId: number, addressId: number): Observable<RegisteredCustomer>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

    return this.http.put<RegisteredCustomer>(baseURL +'users/'+userId+'/addresses/'+addressId, address, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  removeAddress(userId:number, addressId:number):Observable<any>{
    return this.http.delete<any>(baseURL+ 'users/'+userId+'/addresses/'+ addressId).pipe(catchError(this.processHTTPMsgService.handleError));
  }

  addNewProducttoWishList(id:number, productId: number):Observable<RegisteredCustomer>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<RegisteredCustomer>(baseURL+ 'users/'+ id+'/wishlist', {"id": productId}, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  
  removeProductfromWishList(userId:number, productId:number):Observable<any>{
    return this.http.delete<any>(baseURL+ 'users/'+userId+'/wishlist/'+productId).pipe(catchError(this.processHTTPMsgService.handleError));
  }

  addNewItemtoCart(id:number, item: Item):Observable<RegisteredCustomer>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<RegisteredCustomer>(baseURL+ 'users/'+ id+'/cart', item, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  updateItemofCart(item: Item, userId: number, itemId: number): Observable<RegisteredCustomer>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

    return this.http.put<RegisteredCustomer>(baseURL +'users/'+userId+'/cart/'+itemId, item, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  removeItemfromCart(userId:number, itemId:number):Observable<any>{
    return this.http.delete<any>(baseURL+ 'users/'+userId+'/cart/'+ itemId).pipe(catchError(this.processHTTPMsgService.handleError));
  }

  addNewOrder(id:number, order: Order):Observable<RegisteredCustomer>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<RegisteredCustomer>(baseURL+ 'users/'+ id+'/orders', order, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  updateOrder(order: Order, userId: number, orderId: number): Observable<RegisteredCustomer>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

    return this.http.put<RegisteredCustomer>(baseURL +'users/'+userId+'/orders/'+orderId, order, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  removeOrder(userId:number, orderId:number):Observable<any>{
    return this.http.delete<any>(baseURL+ 'users/'+userId+'/orders/'+ orderId).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  addNewContact(id:number, contact: String):Observable<RegisteredCustomer>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<RegisteredCustomer>(baseURL+ 'users/'+ id+'/contacts', {"contactNumber": contact}, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  
  // removeContact(userId:number, addressId:number):Observable<any>{
  //   return this.http.delete<any>(baseURL+ 'users/'+userId+'/orderItems/'+ addressId).pipe(catchError(this.processHTTPMsgService.handleError));
  // }

  deleteUser(userId:number):Observable<any>{
    return this.http.delete<any>(baseURL+ 'users/'+userId).pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
