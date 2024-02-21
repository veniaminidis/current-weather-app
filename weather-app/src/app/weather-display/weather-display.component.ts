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
    // Check if weather data is stored in local storage and if it's not expired
    const storedWeatherData = localStorage.getItem('weatherData');
    const storedTimestamp = localStorage.getItem('weatherTimestamp');

    if (storedWeatherData && storedTimestamp) {
      const currentTime = new Date().getTime();
      const storedTime = parseInt(storedTimestamp, 10);
      if (currentTime - storedTime < 15 * 60 * 1000) { // Check if data is less than 15 minutes old
        this.weatherData = JSON.parse(storedWeatherData);
        return; // Exit the function if stored data is valid
      }
    }

    // If stored data is expired or not available, fetch new data from the API
    this.WeatherAPIService.getCurrentWeather("Thessaloniki", "0b5bb63b15d6afbdcbe481810a3a4e52").subscribe(
      (data: any) => {
        this.weatherData = data;
        console.log(data);

        // Store the fetched weather data and timestamp in local storage
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
      return ''; // No weather data, return empty string (no background)
    }
    this.sunrise = new Date(this.weatherData.sys.sunrise * 1000);
    this.sunset = new Date(this.weatherData.sys.sunset * 1000);

    // Get the weather condition from the data (assuming 'weather' is an array with at least one element)
    const weatherCondition = this.weatherData.weather[0].main.toLowerCase();

    this.currentTime = new Date((this.weatherData.dt * 1000) + (this.weatherData.timezone * 1000));

    const isNighttime = this.currentTime >= this.sunrise || this.currentTime <= this.sunset;

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
        return isNighttime ? 'clear-night-background' : ''; // Default to empty string if weather condition is unknown
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
