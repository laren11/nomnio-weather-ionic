import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './language.reducer';

export const selectLanguageState = createFeatureSelector<State>('language');

export const selectLanguage = createSelector(
  selectLanguageState,
  (s) => s.selected
);
