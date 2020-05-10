import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHttpmsgService } from '../processHttpmsgService/process-httpmsg.service';
import { Admin } from 'src/app/shared/admin';
import { Observable } from 'rxjs';
import { baseURL } from 'src/app/shared/baseurl';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private processHTTPMsgService : ProcessHttpmsgService) { }

  getAdmins():Observable<Admin[]>{
    return this.http.get<Admin[]>(baseURL+'admin').pipe(catchError(this.processHTTPMsgService.handleError));
    
  }
  getAdminById(id: string): Observable<Admin>{
    return this.http.get<Admin>(baseURL+'admin/'+id).pipe(catchError(this.processHTTPMsgService.handleError));
   
  }
  
  updateAdmin(admin:Admin): Observable<Admin>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

    return this.http.put<Admin>(baseURL +'admin/'+admin.id, admin, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  addNewAdmin(admin: Admin):Observable<Admin>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<Admin>(baseURL+ 'admin', admin, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
