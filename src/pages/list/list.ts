import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {RPMData} from '../shared/rpmdata';
import {RpmmeterService} from '../shared/rpmmeter.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage implements OnInit {
  selectedItem: any;
  icons: string[];
  items: Array<{ title: Date; note: number; icon: number }> = [];
  rpmData: Array<RPMData>;
  date: Date;
  rpm: any[];
  duration: number;
  max: number;
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
    // this.hoco();
  }


  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }

  public getTrainings() {
    this.rpmService.getTrainings().subscribe(
      data => {
        // console.log('data ' + data);
        // this.rpmData.push(data);
        this.hoco(data);
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client-side error occured.');
        } else {
          console.log('Server-side error occured.');
        }
      }
    );
  }

  public hoco(rpmData: RPMData[]) {
    for (let i = 0; i < rpmData.length; i++) {
      this.items.push({
        title: rpmData[i].date,
        note: rpmData[i].max,
        icon: rpmData[i].average
      });
    }
  }


}
