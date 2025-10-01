import { createReducer, on } from '@ngrx/store';
import {
  loadWeather,
  loadWeatherSuccess,
  loadWeatherFailure,
} from './weather.actions';

export interface State {
  data?: any;
  loading: boolean;
  error?: string;
}
const initialState: State = { loading: false };

export const weatherReducer = createReducer(
  initialState,
  on(loadWeather, (s) => ({
    ...s,
    loading: true,
    error: undefined,
    data: undefined,
  })),
  on(loadWeatherSuccess, (s, { data }) => ({ ...s, loading: false, data })),
  on(loadWeatherFailure, (s, { error }) => ({
    ...s,
    loading: false,
    error,
    data: undefined,
  }))
);
