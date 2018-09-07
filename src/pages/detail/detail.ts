import {NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {RPMData} from '../shared/rpmdata';

@Component({
  templateUrl: 'detail.html'
})
export class DetailPage {
  rpmData: RPMData;
  chartData: Array<number>;
  public lineChartData: Array<any> = [
    {data: this.chartData, label: 'Training Cadency'}
  ];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';


  constructor(private navParams: NavParams) {
    this.rpmData = navParams.get('item');
    this.chartData = [];
    this.lineChartLabels = [];
    for (let i = 0; i <= this.rpmData.rpm.length - 1; i++) {
      this.chartData.push(this.rpmData.rpm[i]);
      this.lineChartLabels.push(i);
    }
    this.lineChartData[0].data = this.chartData;

    // this.lineChartData[0].data = this.rpmData.rpm;
    // console.log('this.lineChartData[0].data '+ this.lineChartData[0].data)
    // this.lineChartLabels.push(Array.from({length:this.rpmData.rpm.length},(v,k)=>k+1));
    // console.log('this.lineChartLabels'+ this.lineChartLabels)
  }
}
