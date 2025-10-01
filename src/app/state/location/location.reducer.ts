import { createReducer, on } from '@ngrx/store';
import { setLocationCity, setLocationCoords } from './location.actions';

export interface State {
  city?: string;
  coords?: { lat: number; lon: number };
}
const initialState: State = {};

export const locationReducer = createReducer(
  initialState,
  on(setLocationCity, (s, { city }) => ({ city })),
  on(setLocationCoords, (s, { lat, lon }) => ({ coords: { lat, lon } }))
);
