import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './location.reducer';

export const selectLocationState = createFeatureSelector<State>('location');

export const selectCity = createSelector(selectLocationState, (s) => s.city);

export const selectCoords = createSelector(
  selectLocationState,
  (s) => s.coords
);
