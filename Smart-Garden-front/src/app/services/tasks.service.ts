import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { task } from '../models/task';
@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private taskApiUrl = "http://127.0.0.1:5000";

  constructor(private http : HttpClient) { }

  createTask(newTask : task) : Observable<any> {
    return this.http.post(`${this.taskApiUrl}/addTask`, newTask, { responseType: 'json' }).pipe(
      map( 
        (response :any) => {
          console.log("Normal create task response : ", response);
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
