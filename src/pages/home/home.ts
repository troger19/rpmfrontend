import {Component, OnInit} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {RpmmeterService} from '../shared/rpmmeter.service';
import {Observable} from 'rxjs/Observable';
import RpmMeter, {PULSE_EVENT} from 'spin-bike-rpm-meter';
import {SimpleTimer} from 'ng2-simple-timer';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Person} from '../shared/person';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  counter: number = 0;
  timerId: string;
  // selectedOption: string;

  pulsesPerSecond: Array<any>;
  chartData: Array<number>;
  isStop = false;
  isStart = false;
  previousTimestamp = '';
  totalMinutes = '';
  gaugeType = 'semi';
  gaugeValue = 0;
  gaugeLabel = 'Cadence';
  gaugeAppendText = 'rpm';
  thresholdConfig = {
    '40': {color: 'yellow'},
    '60': {color: 'green'},
    '100': {color: 'red'}
  };

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

  personForm: FormGroup;
  public persons: Person[];

  constructor(private rpmService: RpmmeterService, public navCtrl: NavController, public alertCtrl: AlertController,
              private st: SimpleTimer, private fb: FormBuilder) {
    this.pulsesPerSecond = [];
    this.chartData = [];
    this.lineChartLabels = [];


  }

  ngOnInit() {
    this.st.newTimer('1sec', 1);
    this.rpmService.getPersons().subscribe(
      data => {
        console.log('Persooooon ', data);
        this.persons = data as Person[];
      },
      error => {
        console.error('Daco je zle ', error);
        return Observable.create(error);
      }
    );

    this.personForm = this.fb.group({
      personControl: [""]
    });

  }


  callback() {
    console.log('hoooohoho ' + this.counter)
    this.counter++;
  }

  onChange(SelectedValue) {
    console.info("Selected:", SelectedValue.tar);
  }


  startWorkout() {
    // console.log(this.selectedOption)
    this.timerId = this.st.subscribe('1sec', () => this.callback());

    this.isStart = true;
    const rpmMeter = new RpmMeter();
    // Start listening to the "pulsesPerSecond". Asks for permission to the microphone. Run start() before
// starting to cycle on the spin bike.
    rpmMeter.start().then((stop) => {
      console.log('Starting listening to pulsesPerSecond...');
      // After each revolution on the bike, a PULSE_EVENT is emitted containing some useful data about it.
      rpmMeter.on(PULSE_EVENT, (pulseData) => {
        // console.log(pulseData);
        console.log('rpm : ' + pulseData.rpm);
        const currentTimestamp = pulseData.timestamp.toString();
        // display only results every 1 second
        if (currentTimestamp.substring(currentTimestamp.length - 7, currentTimestamp.length - 4)
          !== this.previousTimestamp.substring(currentTimestamp.length - 7, currentTimestamp.length - 4)) {
          this.pulsesPerSecond.push(pulseData);
          this.previousTimestamp = currentTimestamp;
          this.chartData.push(pulseData.rpm);
          this.lineChartLabels.push(this.chartData.length);
        }
        this.gaugeValue = pulseData.rpm;
        // This is how the pulseData might look
        // pulseData = {
        // 'timestamp': 1454060831,
        // 	'secondsBetweenPulses': 0.8,
        // 	'rpm': 75
        // };

      });
      const timerId = setInterval(() => {
        if (this.isStop === true) {
          console.log('Stopped listening to pulsesPerSecond...');
          clearTimeout(timerId);
          stop();
        }
      }, 500);

    });
  }

  stopWorkout() {
    this.isStop = true;
    this.isStart = false;
    this.st.unsubscribe(this.timerId);
    this.calculateResult(this.pulsesPerSecond.length);
    this.lineChartData[0].data = this.chartData;
    console.log(this.chartData);
    this.rpmService.createTraining(this.chartData).subscribe(
      data => {
        console.log('Vsetko ok');
        return true;
      },
      error => {
        console.error('Daco je zle ', error);
        return Observable.create(error);
      }
    );
  }

  calculateResult(s: number) {
    this.totalMinutes = (this.pulsesPerSecond.length / 60).toString();
    const minutes = Math.floor(s / 60);
    const seconds = (s % 60).toString();
    const sec = ('00' + seconds).slice(-2);
    console.log(minutes + ':' + seconds);
    this.totalMinutes = minutes + ':' + sec;
  }

  refreshHomePage(): void {
    window.location.reload();
  }

  confirmStop() {
    let alert = this.alertCtrl.create({
      title: 'End of Workout',
      message: 'End workout and save?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.stopWorkout();
          }
        }
      ]
    });
    alert.present();
  }


}
