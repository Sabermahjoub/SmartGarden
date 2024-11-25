import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { plant } from '../models/plant';

@Injectable({
  providedIn: 'root'
})
export class PlantsService {

  private plantApiUrl = "http://127.0.0.1:5000";

  constructor(private http : HttpClient) { }

  createPlant(newPlant : any) : Observable<any> {
    return this.http.post(`${this.plantApiUrl}/addPlant`, newPlant, { responseType: 'json' }).pipe(
      map( 
        (response :any) => {
          console.log("Normal create plant response : ", response);
          return response;
        }
      ), 
      catchError((error :any) => {
        console.error(error);
        return of(error);
      })
    );
  }

  deletePlant(plantName : string) : Observable<any>{
    return this.http.delete(`${this.plantApiUrl}/deletePlant/${plantName}`, { responseType: 'json' }).pipe(
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

  getAllPlants() : Observable<any>{
    return this.http.get(`${this.plantApiUrl}/getPlants`, { responseType: 'json' }).pipe(
      map( 
        (response :any) => {
          console.log("Normal get Plants response : ", response);
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
