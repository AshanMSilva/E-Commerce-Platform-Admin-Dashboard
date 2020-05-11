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

  uploadCategoryImage(file: any):Observable<any>{
    const httpOptions ={
      
    };
    return this.http.post<any>('http://localhost:3000/'+ 'imageUpload/category', file).pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
