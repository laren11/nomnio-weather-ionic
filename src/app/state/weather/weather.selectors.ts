import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './weather.reducer';

export const selectWeatherState = createFeatureSelector<State>('weather');

export const selectWeather = createSelector(selectWeatherState, (s) => s.data);

export const selectWeatherLoading = createSelector(
  selectWeatherState,
  (s) => s.loading
);

export const selectWeatherError = createSelector(
  selectWeatherState,
  (s) => s.error
);
