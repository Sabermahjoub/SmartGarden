import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { login } from '../models/login';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginApiUrl = "http://127.0.0.1:5000";

  constructor(private http : HttpClient) { }


  login(login_request : login) : Observable<any>{
    return this.http.post(`${this.loginApiUrl}/login`, login_request, { responseType: 'json' }).pipe(
      map( 
        (response :any) => {
          console.log("Normal Login response : ", response);
          return response;
        }
      ), 
      catchError((error :any) => {
        console.error(error);
        return of(error);
      })
    );
  }

}
