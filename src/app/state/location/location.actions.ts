import { createAction, props } from '@ngrx/store';

export const setLocationCity = createAction(
  '[Loc] City',
  props<{ city: string }>()
);

export const setLocationCoords = createAction(
  '[Loc] Coords',
  props<{ lat: number; lon: number }>()
);
