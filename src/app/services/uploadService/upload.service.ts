import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHttpmsgService } from '../processHttpmsgService/process-httpmsg.service';
import { Observable } from 'rxjs';
import { baseURL } from 'src/app/shared/baseurl';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient, private processHTTPMsgService : ProcessHttpmsgService) { }

  uploadCategoryImage(id:number, file: any):Observable<any>{
    const httpOptions ={
      
    };
    return this.http.post<any>(baseURL+ 'imageUpload/category/'+id, file).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  uploadProductImage(id:number, file: any):Observable<any>{
    const httpOptions ={
      
    };
    return this.http.post<any>(baseURL+ 'imageUpload/product/'+id, file).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  uploadPofilePicture(id:number, file: any):Observable<any>{
    const httpOptions ={
      
    };
    return this.http.post<any>(baseURL+ 'imageUpload/profilePicture/'+id, file).pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
