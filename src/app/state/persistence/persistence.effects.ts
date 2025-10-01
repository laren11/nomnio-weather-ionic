import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { setLanguage } from '../language/language.actions';
import {
  setLocationCity,
  setLocationCoords,
} from '../location/location.actions';
import { tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectLanguage } from '../language/language.selectors';
import { selectCity, selectCoords } from '../location/location.selectors';

const LS_KEY = 'ionic-weather-state';

@Injectable()
export class PersistenceEffects {
  constructor(private actions$: Actions, private store: Store) {}

  save$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setLanguage, setLocationCity, setLocationCoords),
        withLatestFrom(
          this.store.select(selectLanguage),
          this.store.select(selectCity),
          this.store.select(selectCoords)
        ),
        tap(([_, lang, city, coords]) => {
          const payload = {
            lang,
            selectedLocationName: city
              ? city === 'DefinitelyNotACity'
                ? 'Invalid'
                : city
              : coords
              ? 'Current'
              : '',
            lastCity: city,
            lastCoords: coords || undefined,
          };
          localStorage.setItem(LS_KEY, JSON.stringify(payload));
        })
      ),
    { dispatch: false }
  );
}
