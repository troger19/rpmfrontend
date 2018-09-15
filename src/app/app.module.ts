import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ListPage} from '../pages/list/list';
import {DetailPage} from '../pages/detail/detail';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {NgxGaugeModule} from 'ngx-gauge';
import {ChartsModule} from 'ng2-charts';
import {HttpClientModule} from '@angular/common/http';
import {RpmmeterService} from '../pages/shared/rpmmeter.service';
import {LoadingModule} from 'ngx-loading';
import {SimpleTimer} from 'ng2-simple-timer';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    DetailPage
  ],
  imports: [
    BrowserModule,
    NgxGaugeModule,
    HttpClientModule,
    ChartsModule,
    LoadingModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    DetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RpmmeterService,
    SimpleTimer
  ]
})
export class AppModule {}
