import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHttpmsgService } from '../processHttpmsgService/process-httpmsg.service';
import { Observable } from 'rxjs';
import { baseURL } from 'src/app/shared/baseurl';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private http: HttpClient, private processHTTPMsgService : ProcessHttpmsgService) {

   }
   sendMail(body:any):Observable<any>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<any>(baseURL+ 'mail', body, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));

   }
}
