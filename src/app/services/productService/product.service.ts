import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHttpmsgService } from '../processHttpmsgService/process-httpmsg.service';
import { Observable } from 'rxjs';
import { Product } from 'src/app/shared/product';
import { baseURL } from 'src/app/shared/baseurl';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private processHTTPMsgService : ProcessHttpmsgService) { }

  getProducts():Observable<Product[]>{
    return this.http.get<Product[]>(baseURL+'products').pipe(catchError(this.processHTTPMsgService.handleError));
    
  }
  getProductById(id: string): Observable<Product>{
    return this.http.get<Product>(baseURL+'products/'+id).pipe(catchError(this.processHTTPMsgService.handleError));
   
  }
  getTopProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(baseURL+'products?topProduct=true').pipe(map(products=>products)).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  updateProduct(id:number, product:any): Observable<Product>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

    return this.http.put<Product>(baseURL +'products/'+id, product, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  addNewProduct(product:any):Observable<Product>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<Product>(baseURL+ 'products', product, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  addNewVarient(productId:number, varient:any):Observable<Product>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<Product>(baseURL+ 'products/'+ productId+'/varients',varient, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  removeVarient(productId:number, varientId:number):Observable<any>{
    return this.http.delete<any>(baseURL+ 'products/'+productId+'/varients/'+ varientId).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  deleteProduct(productId:number):Observable<any>{
    return this.http.delete<any>(baseURL+ 'products/'+productId).pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
