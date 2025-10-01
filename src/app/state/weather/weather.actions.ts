import { createAction, props } from '@ngrx/store';

export const loadWeather = createAction('[Weather] Load');

export const loadWeatherSuccess = createAction(
  '[Weather] Success',
  props<{ data: any }>()
);

export const loadWeatherFailure = createAction(
  '[Weather] Failure',
  props<{ error: string }>()
);
