import { Routes } from '@angular/router';
import { WeatherPage } from './pages/weather/weather.page';

export const routes: Routes = [
  { path: '', component: WeatherPage },
  { path: '**', redirectTo: '' },
];
