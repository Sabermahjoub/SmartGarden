import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  private predictionApiUrl = "http://127.0.0.1:5000";

  constructor(private http : HttpClient) { }

  ML_predict(predictionRequest : any) : Observable<any> {
    return this.http.post(`${this.predictionApiUrl}/predict_ML`, predictionRequest, { responseType: 'json' }).pipe(
      map( 
        (response :any) => {
          console.log("Normal ML prediction response : ", response);
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
