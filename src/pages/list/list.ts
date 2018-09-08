import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {RPMData} from '../shared/rpmdata';
import {RpmmeterService} from '../shared/rpmmeter.service';
import {HttpErrorResponse} from '@angular/common/http';
import {DetailPage} from '../detail/detail';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage implements OnInit {
  public loading = false;
  selectedItem: any;
  icons: string[];
  items: Array<{ date: Date; duration: number; average: number, rpm: any[], personName: string }> = [];
  // items: Array<RPMData> = [];
  rpmData: Array<RPMData>;
  date: Date;
  rpm: any[];
  duration: number;
  average: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private rpmService: RpmmeterService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    this.rpmData = [];
  }


  ngOnInit() {
    this.getTrainings();
    // this.parseIntoArray();
  }


  itemTapped(event, item) {
    this.navCtrl.push(DetailPage, {
      item: item
    });
  }

  public getTrainings() {
    this.loading = true;
    this.rpmService.getTrainings().subscribe(
      data => {
        this.loading = false;
        this.parseIntoArray(data);
      },
      (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log('Server-side error occured.');
        }
      }
    );
  }

  public parseIntoArray(rpmData: RPMData[]) {
    for (let i = 0; i < rpmData.length; i++) {
      this.items.push({
        date: rpmData[i].date,
        duration: rpmData[i].duration,
        average: rpmData[i].average,
        rpm: rpmData[i].rpm,
        personName: rpmData[i].personName
      });
    }
    this.items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }


}
