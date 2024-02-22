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
  sunrise = new Date();
  sunset = new Date();
  currentTime = new Date();
  currentDate = ""

  constructor(private WeatherAPIService: WeatherAPIService) { }

  ngOnInit(): void {
    this.getWeatherData();
  }

  getWeatherData() {
    const storedWeatherData = localStorage.getItem('weatherData');
    const storedTimestamp = localStorage.getItem('weatherTimestamp');

    if (storedWeatherData && storedTimestamp) {
      const currentTime = new Date().getTime();
      const storedTime = parseInt(storedTimestamp, 10);
      if (currentTime - storedTime < 15 * 60 * 1000) {
        this.weatherData = JSON.parse(storedWeatherData);
        return;
      }
    }

    this.WeatherAPIService.getCurrentWeather("Thessaloniki", "0b5bb63b15d6afbdcbe481810a3a4e52").subscribe(
      (data: any) => {
        this.weatherData = data;
        console.log(data);

        localStorage.setItem('weatherData', JSON.stringify(data));
        localStorage.setItem('weatherTimestamp', new Date().getTime().toString());
      },
      (error) => {
        console.error('Error fetching weather data:', error);
      }
    );
  }

  getWeatherBackground() {
    if (!this.weatherData) {
      return '';
    }
    this.sunrise = new Date(this.weatherData.sys.sunrise * 1000);
    this.sunset = new Date(this.weatherData.sys.sunset * 1000);

    const weatherCondition = this.weatherData.weather[0].main.toLowerCase();

    this.currentTime = new Date((this.weatherData.dt * 1000) + (this.weatherData.timezone * 1000));

    const isNighttime = this.currentTime >= this.sunset || this.currentTime <= this.sunrise;

    switch (weatherCondition) {
      case 'clear':
        return isNighttime ? 'clear-night-background' : 'clear-sky-background';
      case 'clouds':
        return isNighttime ? 'cloudy-night-background' : 'cloudy-background';
      case 'rain':
      case 'drizzle':
        return isNighttime ? 'rainy-night-background' : 'rainy-background';
      case 'snow':
        return isNighttime ? 'snowy-night-background' : 'snowy-background';
      default:
        return isNighttime ? 'clear-night-background' : '';
    }
  }

  getBackgroundImage() {
    if (!this.weatherData) {
      return '';
    }

    const weatherCondition = this.weatherData.weather[0].main.toLowerCase();
    
    switch (weatherCondition) {
      case 'clear':
        return '';
      case 'clouds':
        return "https://www.freeiconspng.com/uploads/white-clouds-png-15.png";
      case 'rain':
      case 'drizzle':
        return "https://www.freeiconspng.com/uploads/rain-png-clipart-18.png";
      case 'snow':
        return "https://www.freeiconspng.com/uploads/white-snowflake-png-2.png";
      default:
        return '';
    }
  }

  getDayDate() {
    switch (this.currentTime.getDay()) {
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      case 7:
        return "Sunday";
      default:
        return "";
    }
  }

}
