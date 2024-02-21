import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherAPIService {

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string, apiKey: string) {
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0b5bb63b15d6afbdcbe481810a3a4e52`);
  }
}
