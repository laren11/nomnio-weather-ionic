import { createReducer, on } from '@ngrx/store';
import { setLanguage } from './language.actions';

export interface State {
  selected: 'en' | 'slo' | 'de';
}
const initialState: State = { selected: 'en' };

export const languageReducer = createReducer(
  initialState,
  on(setLanguage, (s, { lang }) => ({ ...s, selected: lang }))
);
