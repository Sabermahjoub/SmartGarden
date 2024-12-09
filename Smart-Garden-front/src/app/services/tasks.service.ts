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

  deleteTask(task_id : number) : Observable<any> {
    return this.http.delete(`${this.taskApiUrl}/deleteTask/${task_id}`, { responseType: 'json' }).pipe(
      map( 
        (response :any) => {
          return response;
        }
      ), 
      catchError((error :any) => {
        console.error(error);
        return of(error);
      })
    );
  }

  updateTaskStatus(task_id : number) : Observable<any> {
    return this.http.put(`${this.taskApiUrl}/updateTaskStatus/${task_id}`, {"done" : 1}, { responseType: 'json' }).pipe(
      map( 
        (response :any) => {
          return response;
        }
      ), 
      catchError((error :any) => {
        console.error(error);
        return of(error);
      })
    );
  }
  
  getTasks() : Observable<any> {
    return this.http.get(`${this.taskApiUrl}/getTasks`, { responseType: 'json' }).pipe(
      map( 
        (response :any) => {
          return response;
        }
      ), 
      catchError((error :any) => {
        console.error(error);
        return of(error);
      })
    );
  }


  createTask(newTask : task) : Observable<any> {
    return this.http.post(`${this.taskApiUrl}/addTask`, newTask, { responseType: 'json' }).pipe(
      map( 
        (response :any) => {
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
