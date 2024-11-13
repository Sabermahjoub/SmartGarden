import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { WeatherApiData, fahrenheitToCelsius, convertMphToKmph, determineSevereRiskOfCatastrophe } from 'src/app/models/weather_data';

@Injectable({
  providedIn: 'root'
})
export class DateHourTempService {

  //private apiUrl = 'http://api.timezonedb.com/v2.1/list-time-zone?key=5TFD9L5CIQR8&format=xml&country=TN';
  private weatherUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Tunis?key=6N7KTZVR8JH3UUGBKTBBY45FG";
  
  incrementHour(time: string): string {
    // Split the time string by ":"
    const [hourStr, minuteStr, secondStr] = time.split(":");
  
    // Parse the hour as number
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const second = parseInt(secondStr, 10);

    if(hour===23) return "newday";

    // Increment the hour and wrap around if it exceeds 23
    hour = (hour + 1) % 24;

    // Format the new hour, minute, and second as two-digit strings
    const newHourStr = hour.toString().padStart(2, "0");
    const newMinuteStr = minute.toString().padStart(2, "0");
    const newSecondStr = second.toString().padStart(2, "0");

    // Return the new time string
    return `${newHourStr}:${newMinuteStr}:${newSecondStr}`;
  }
  
  constructor(private http : HttpClient) { }

  getWeatherData(time_param : string): Observable<WeatherApiData> {
    return this.http.get(this.weatherUrl, { responseType: 'json' }).pipe(
      map((response : any) => {
        const hourData = response.days[0]?.hours.find((hour: any) => hour.datetime === time_param);
        let hourDataPlus1 = null;
        if(this.incrementHour(time_param) === "newday") {
          hourDataPlus1 = response.days[1]?.hours.find((hour: any) => hour.datetime === "00:00:00" );
        }
        else {
          hourDataPlus1 = response.days[0]?.hours.find((hour: any) => hour.datetime === time_param.replace(time_param[0],String(Number(time_param[0])+1)));
        }
        const weatherApiData : WeatherApiData = {
          minTemperature: Math.floor(fahrenheitToCelsius(response.days[0]?.tempmin)),
          maxTemperature: Math.floor(fahrenheitToCelsius(response.days[0]?.tempmax)),
          description : response.days[0]?.conditions,
          uvindex : hourData ? hourData.uvindex : null,
          windspeed : hourData ? Math.floor(convertMphToKmph(hourData.windspeed)) : null,
          risk : hourDataPlus1 ? determineSevereRiskOfCatastrophe(hourDataPlus1.severerisk) : null
        };
        console.log("Weather API DATA after filtring : ",weatherApiData);
        return weatherApiData
      }),
      catchError(error => {
        console.error(error);
        const weatherApiData : WeatherApiData = {
          minTemperature: null,
          maxTemperature: null,
          description : null,
          uvindex : null,
          windspeed : null,
          risk : null
        };
        return of(weatherApiData);
      })
    );
  };

}
