import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHttpmsgService } from '../processHttpmsgService/process-httpmsg.service';
import { Observable } from 'rxjs';
import { baseURL } from 'src/app/shared/baseurl';
import { catchError } from 'rxjs/operators';
import { Order } from 'src/app/shared/order';
import { Item } from 'src/app/shared/cartItem';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private processHTTPMsgService : ProcessHttpmsgService) { }

  getOrders():Observable<Order[]>{
    return this.http.get<Order[]>(baseURL+'orders').pipe(catchError(this.processHTTPMsgService.handleError));
    
  }
  getOrderById(id: string): Observable<Order>{
    return this.http.get<Order>(baseURL+'orders/'+id).pipe(catchError(this.processHTTPMsgService.handleError));
   
  }
  
  updateOrder(order:Order): Observable<Order>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

    return this.http.put<Order>(baseURL +'orders/'+order._id, order, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  addNewOrder(order: Order):Observable<Order>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<Order>(baseURL+ 'orders', order, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  addNewOrderItem(id:number, orderItem: Item):Observable<Order>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<Order>(baseURL+ 'orders/'+ id+'/orderItems', orderItem, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  updateOrderItem(orderItem: Item, orderId: number, orderItemId: number): Observable<Order>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

    return this.http.put<Order>(baseURL +'orders/'+orderId+'/orderItems/'+orderItemId, orderItem, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  removeOrderItem(orderId:number, orderItemId:number):Observable<any>{
    return this.http.delete<any>(baseURL+ 'orders/'+orderId+'/orderItems/'+ orderItemId).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  deleteOrder(orderId:number):Observable<any>{
    return this.http.delete<any>(baseURL+ 'orders/'+orderId).pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
