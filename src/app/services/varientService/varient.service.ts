import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHttpmsgService } from '../processHttpmsgService/process-httpmsg.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { baseURL } from 'src/app/shared/baseurl';
import { Varient } from 'src/app/shared/varient';
import { Attribute } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class VarientService {

  constructor(private http: HttpClient, private processHTTPMsgService : ProcessHttpmsgService) { }

  getVarients():Observable<Varient[]>{
    return this.http.get<Varient[]>(baseURL+'varients').pipe(catchError(this.processHTTPMsgService.handleError));
    
  }
  getVarientById(id: string): Observable<Varient>{
    return this.http.get<Varient>(baseURL+'varients/'+id).pipe(catchError(this.processHTTPMsgService.handleError));
   
  }
  
  updateVarient(varient:Varient): Observable<Varient>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

    return this.http.put<Varient>(baseURL +'varients/'+varient.id, varient, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  addNewVarient(varient: Varient):Observable<Varient>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<Varient>(baseURL+ 'varients', varient, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  addNewAttribute(id:number, attribute: Attribute):Observable<Varient>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<Varient>(baseURL+ 'varients/'+ id+'/attributes', attribute, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  updateAttribute(attribute:Attribute, varientId: number, attributeId: number): Observable<Varient>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

    return this.http.put<Varient>(baseURL +'varients/'+varientId+'/attributes/'+attributeId,attribute, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  removeAttribute(varientId:number, attributeId:number):Observable<any>{
    return this.http.delete<any>(baseURL+ 'varients/'+varientId+'/attributes/'+ attributeId).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  deleteVarient(varientId:number):Observable<any>{
    return this.http.delete<any>(baseURL+ 'varients/'+varientId).pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
