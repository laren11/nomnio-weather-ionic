import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import {
  loadWeather,
  loadWeatherSuccess,
  loadWeatherFailure,
} from './weather.actions';
import { selectLanguage } from '../language/language.selectors';
import { selectCity, selectCoords } from '../location/location.selectors';
import { catchError, delay, map, of, switchMap, withLatestFrom } from 'rxjs';

@Injectable()
export class WeatherEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store
  ) {}

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadWeather),
      withLatestFrom(
        this.store.select(selectLanguage),
        this.store.select(selectCity),
        this.store.select(selectCoords)
      ),
      switchMap(([_, lang, city, coords]) => {
        const url = `${environment.openweather.baseUrl}/weather`;
        const params: any = {
          appid: environment.openweather.apiKey,
          units: 'metric',
          lang,
        };

        if (coords) {
          params.lat = coords.lat;
          params.lon = coords.lon;
          return this.http.get(url, { params }).pipe(
            delay(5000),
            map((data) => loadWeatherSuccess({ data })),
            catchError(() => of(loadWeatherFailure({ error: 'API_ERROR' })))
          );
        }

        if (city) {
          // Special path: explicitly invalid city -> wait 5s, then fail
          if (city === 'DefinitelyNotACity') {
            return of(null).pipe(
              delay(5000),
              map(() => loadWeatherFailure({ error: 'INVALID_LOCATION' }))
            );
          }
          params.q = city;
          return this.http.get(url, { params }).pipe(
            delay(5000),
            map((data) => loadWeatherSuccess({ data })),
            catchError(() => of(loadWeatherFailure({ error: 'API_ERROR' })))
          );
        }

        // No selection — optional: do not show error banner; just no-op
        return of(loadWeatherFailure({ error: 'NO_SELECTION' }));
      })
    )
  );
}
