import { Component, OnInit } from '@angular/core';
import { WeatherAPIService } from '../weather-api.service';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrl: './weather-display.component.scss'
})
export class WeatherDisplayComponent implements OnInit {

  weatherData: any;
  Math = Math;

  constructor(private WeatherAPIService: WeatherAPIService) { }

  ngOnInit(): void {
    this.getWeatherData();
  }

  getWeatherData() {    
    this.WeatherAPIService.getCurrentWeather("Thessaloniki" , "0b5bb63b15d6afbdcbe481810a3a4e52").subscribe(
      (data: any) => {
        this.weatherData = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching weather data:', error);
      }
    );
    // console.log(this.WeatherAPIService.getCurrentWeather("Thessaloniki" , "0b5bb63b15d6afbdcbe481810a3a4e52"));
  }

  getWeatherBackground() {
    if (!this.weatherData) {
      return ''; // No weather data, return empty string (no background)
    }
    const sunrise = new Date(this.weatherData.sys.sunrise * 1000);
    const sunset = new Date(this.weatherData.sys.sunrise * 1000);

    // Get the weather condition from the data (assuming 'weather' is an array with at least one element)
    const weatherCondition = this.weatherData.weather[0].main.toLowerCase();

    const currentTime = new Date((this.weatherData.dt * 1000) + (this.weatherData.timezone * 1000));

    const isNighttime = currentTime >= sunrise || currentTime <= sunset;

    // Determine the background class based on the weather condition and time of day
    switch (weatherCondition) {
      case 'clear':
        return isNighttime ? 'clear-night-background' : 'sunny-background';
      case 'clouds':
        return isNighttime ? 'cloudy-night-background' : 'cloudy-background';
      case 'rain':
      case 'drizzle':
        return isNighttime ? 'rainy-night-background' : 'rainy-background';
      case 'snow':
        return isNighttime ? 'snowy-night-background' : 'snowy-background';
      default:
        return isNighttime ? 'nighttime-background' : ''; // Default to empty string if weather condition is unknown
    }
  }

}
