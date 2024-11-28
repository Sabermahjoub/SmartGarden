import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { logs } from '../models/logs';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  private logsApiUrl = "http://127.0.0.1:5000";

  constructor(private http : HttpClient) { }

  getAllLogs() : Observable<any>{
    return this.http.get(`${this.logsApiUrl}/getLogs`, { responseType: 'json' }).pipe(
      map( 
        (response :any) => {
          console.log("Normal get Logs response : ", response);
          return response;
        }
      ), 
      catchError((error :any) => {
        console.error(error);
        return of(error);
      })
    );
  }

  deleteLogs(log_id : number) : Observable<any>{
    return this.http.delete(`${this.logsApiUrl}/deleteLog/${log_id}`, { responseType: 'json' }).pipe(
      map( 
        (response :any) => {
          console.log("Normal delete response : ", response);
          return response;
        }
      ), 
      catchError((error :any) => {
        console.error(error);
        return of(error);
      })
    );
    
  };


}
