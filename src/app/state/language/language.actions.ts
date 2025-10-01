import { createAction, props } from '@ngrx/store';

export const setLanguage = createAction(
  '[Lang] Set',
  props<{ lang: 'en' | 'slo' | 'de' }>()
);
