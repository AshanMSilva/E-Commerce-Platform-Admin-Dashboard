import { Injectable } from '@angular/core';

import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { baseURL } from "../../shared/baseurl";
import { map , catchError} from "rxjs/operators";
import { ProcessHttpmsgService } from "../processHttpmsgService/process-httpmsg.service";
import { Category } from 'src/app/shared/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private processHTTPMsgService : ProcessHttpmsgService) { }

  getCategories():Observable<Category[]>{
    return this.http.get<Category[]>(baseURL+'categories').pipe(catchError(this.processHTTPMsgService.handleError));
    
  }
  getCategoryById(id: string): Observable<Category>{
    return this.http.get<Category>(baseURL+'categories/'+id).pipe(catchError(this.processHTTPMsgService.handleError));
   
  }
  getTopCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(baseURL+'categories?topCategory=true').pipe(map(categories=>categories)).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  updateCategory(category:Category): Observable<Category>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

    return this.http.put<Category>(baseURL +'categories/'+category.id,category,httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  addNewCategory(category: Category):Observable<Category>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<Category>(baseURL+ 'categories',category,httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  addNewSubCategory(categoryId:number, subcategoryId:number):Observable<Category>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<Category>(baseURL+ 'categories/'+categoryId+'/subCategories',{"id":subcategoryId}, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  deleteSubCategory(categoryId:number, subcategoryId:number):Observable<any>{
    return this.http.delete<any>(baseURL+ 'categories/'+categoryId+'/subCategories/'+subcategoryId).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  addNewProduct(categoryId:number, productId:number):Observable<Category>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<Category>(baseURL+ 'categories/'+categoryId+'/products',{"id":productId}, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  deleteProduct(categoryId:number, productId:number):Observable<any>{
    return this.http.delete<any>(baseURL+ 'categories/'+categoryId+'/products/'+productId).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  deleteCategory(categoryId:number):Observable<any>{
    return this.http.delete<any>(baseURL+ 'categories/'+categoryId).pipe(catchError(this.processHTTPMsgService.handleError));
  }

}
