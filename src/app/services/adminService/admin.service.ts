import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProcessHttpmsgService } from '../processHttpmsgService/process-httpmsg.service';
import { Admin } from 'src/app/shared/admin';
import { Observable } from 'rxjs';
import { baseURL } from 'src/app/shared/baseurl';
import { catchError, map } from 'rxjs/operators';

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
  
  updateAdmin(adminId:any, body:any): Observable<Admin>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };

    return this.http.put<Admin>(baseURL +'admin/'+adminId, body, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  addNewAdmin(admin: any):Observable<Admin>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<Admin>(baseURL+ 'admin/signup', admin, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  deleteAdmin(adminId:number):Observable<any>{
    return this.http.delete<any>(baseURL+ 'admin/'+adminId).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  changePassword(adminId: any, body:any):Observable<any>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<any>(baseURL+ 'admin/'+adminId+'/changePassword', body, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }
  getAdminByEmail(email:string):Observable<Admin[]>{
    return this.http.get<Admin[]>(baseURL+`admin?email=${email}`).pipe(catchError(this.processHTTPMsgService.handleError));
  
  }
  forgotPassword(adminId: any, body:any):Observable<any>{
    const httpOptions ={
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    };
    return this.http.post<any>(baseURL+ 'admin/'+adminId+'/forgotPassword', body, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
  }

}
