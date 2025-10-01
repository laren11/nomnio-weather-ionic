import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {
  TranslateHttpLoader,
  TRANSLATE_HTTP_LOADER_CONFIG,
} from '@ngx-translate/http-loader';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { languageReducer } from './app/state/language/language.reducer';
import { locationReducer } from './app/state/location/location.reducer';
import { weatherReducer } from './app/state/weather/weather.reducer';
import { WeatherEffects } from './app/state/weather/weather.effects';
import { PersistenceEffects } from './app/state/persistence/persistence.effects';
import { addIcons } from 'ionicons';
import {
  sunnyOutline,
  chevronDownOutline,
  chevronForwardOutline,
  partlySunnyOutline,
} from 'ionicons/icons';

addIcons({
  'sunny-outline': sunnyOutline,
  'chevron-down-outline': chevronDownOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'partly-sunny-outline': partlySunnyOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
      language: languageReducer,
      location: locationReducer,
      weather: weatherReducer,
    }),
    provideEffects([WeatherEffects, PersistenceEffects]),
    provideStoreDevtools({ maxAge: 25 }),
    // ngx-translate
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useClass: TranslateHttpLoader,
        },
      })
    ),

    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: './assets/i18n/',
        suffix: '.json',
      },
    },
  ],
});
