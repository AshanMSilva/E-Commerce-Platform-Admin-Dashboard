import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHttpmsgService } from '../processHttpmsgService/process-httpmsg.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { baseURL } from 'src/app/shared/baseurl';
import { Varient } from 'src/app/shared/varient';
import { Attribute } from '@angular/compiler';
import { Product } from 'src/app/shared/product';

@Injectable({
  providedIn: 'root'
})
export class VarientService {

  constructor(private http: HttpClient, private processHTTPMsgService : ProcessHttpmsgService) { }

  getVarients(productId:number):Observable<Varient[]>{
    return this.http.get<Varient[]>(baseURL+'products/'+productId+'/varients').pipe(catchError(this.processHTTPMsgService.handleError));
    
  }
  getVarientById(productId:number, id: string): Observable<Varient>{
    return this.http.get<Varient>(baseURL+'products/'+productId+'/varients/'+id).pipe(catchError(this.processHTTPMsgService.handleError));
   
  }
  
  updateVarient(productId: any, varientId: any, varient:any): Observable<Varient>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

    return this.http.put<Varient>(baseURL+'products/'+productId+'/varients/'+varientId, varient, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  addNewVarient(productId:number, varient: any):Observable<Product>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<Product>(baseURL+'products/'+productId+'/varients', varient, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  addNewAttribute(productId:number, id:string, attribute: any):Observable<Varient>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<Varient>(baseURL+'products/'+productId+'/varients/'+ id+'/attributes', attribute, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  updateAttribute(productId:number, attribute:any, varientId: number, attributeId: number): Observable<Varient>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

    return this.http.put<Varient>(baseURL+'products/'+productId+'/varients/'+varientId+'/attributes/'+attributeId,attribute, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  removeAttribute(productId:number, varientId:number, attributeId:number):Observable<any>{
    return this.http.delete<any>(baseURL+'products/'+productId+'/varients/'+varientId+'/attributes/'+ attributeId).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  deleteVarient(productId:number, varientId:number):Observable<Product>{
    return this.http.delete<Product>(baseURL+'products/'+productId+'/varients/'+varientId).pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
