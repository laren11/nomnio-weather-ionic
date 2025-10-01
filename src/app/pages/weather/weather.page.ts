import { Component } from '@angular/core';
import {
  NgIf,
  AsyncPipe,
  DatePipe,
  DecimalPipe,
  UpperCasePipe,
} from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActionSheetController } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { setLanguage } from '../../state/language/language.actions';
import {
  setLocationCity,
  setLocationCoords,
} from '../../state/location/location.actions';
import { loadWeather } from '../../state/weather/weather.actions';
import { selectLanguage } from '../../state/language/language.selectors';
import {
  selectWeather,
  selectWeatherLoading,
  selectWeatherError,
} from '../../state/weather/weather.selectors';

type Lang = 'en' | 'slo' | 'de';
const LS_KEY = 'ionic-weather-state';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    UpperCasePipe,
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
    IonIcon,
  ],
})
export class WeatherPage {
  weather$ = this.store.select(selectWeather);
  loading$ = this.store.select(selectWeatherLoading);
  error$ = this.store.select(selectWeatherError);

  selectedLang: Lang = 'en';
  selectedLocationName = '';

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private i18n: TranslateService,
    private store: Store
  ) {
    this.store.select(selectLanguage).subscribe((l) => {
      this.selectedLang = l;
      this.i18n.use(l);
    });

    const savedRaw = localStorage.getItem(LS_KEY);
    if (savedRaw) {
      try {
        const saved = JSON.parse(savedRaw);
        if (saved.lang) this.store.dispatch(setLanguage({ lang: saved.lang }));
        if (saved.lastCoords) {
          this.selectedLocationName = 'Current';
          this.store.dispatch(setLocationCoords(saved.lastCoords));
          this.store.dispatch(loadWeather());
        } else if (saved.lastCity) {
          this.selectedLocationName =
            saved.lastCity === 'DefinitelyNotACity'
              ? 'Invalid'
              : saved.lastCity;
          this.store.dispatch(setLocationCity({ city: saved.lastCity }));
          this.store.dispatch(loadWeather());
        }
      } catch {}
    }
  }

  onRefresh(ev: CustomEvent) {
    this.store.dispatch(loadWeather());
    setTimeout(() => (ev.target as any).complete(), 300); // quick finish UI
  }

  // LANGUAGE
  async openLanguageSheet() {
    const t = (k: string) => this.i18n.instant(k);
    const sheet = await this.actionSheetCtrl.create({
      header: t('SELECT_LANGUAGE'),
      cssClass: 'bottom-sheet',
      mode: 'md',
      buttons: [
        { text: 'English', handler: () => this.setLang('en') },
        { text: 'Slovenščina', handler: () => this.setLang('slo') },
        { text: 'Deutsch', handler: () => this.setLang('de') },
        { text: t('CANCEL'), role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  setLang(lang: Lang) {
    this.store.dispatch(setLanguage({ lang }));
    if (this.selectedLocationName) this.store.dispatch(loadWeather());
  }

  // LOCATION
  async openLocationSheet() {
    const t = (k: string) => this.i18n.instant(k);
    const sheet = await this.actionSheetCtrl.create({
      header: t('SELECT_LOCATION'),
      cssClass: 'bottom-sheet',
      mode: 'md', // 👈 same here
      buttons: [
        {
          text: t('CURRENT_LOCATION'),
          handler: () => this.useCurrentLocation(),
        },
        { text: 'Maribor', handler: () => this.setCity('Maribor') },
        { text: 'Celje', handler: () => this.setCity('Celje') },
        { text: 'Ljubljana', handler: () => this.setCity('Ljubljana') },
        {
          text: t('LOC_INVALID'),
          handler: () => this.setCity('DefinitelyNotACity'),
        },
        { text: t('CANCEL'), role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  async useCurrentLocation() {
    try {
      const { Geolocation } = await import('@capacitor/geolocation');
      const pos = await Geolocation.getCurrentPosition();
      this.selectedLocationName = 'Current';
      this.store.dispatch(
        setLocationCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        })
      );
      this.store.dispatch(loadWeather());
    } catch {}
  }

  setCity(name: string) {
    this.selectedLocationName =
      name === 'DefinitelyNotACity' ? this.i18n.instant('LOC_INVALID') : name;
    this.store.dispatch(setLocationCity({ city: name }));
    this.store.dispatch(loadWeather());
  }
}
