import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {RPMData} from './rpmdata';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class RpmmeterService {
  rpmData: RPMData;

  constructor(private http: HttpClient) {
  }

  createTraining(rpmData) {
    const avg = rpmData.reduce(function (p, c, i, a) {
      return p + (c / a.length);
    }, 0); // calculate average value from the training
    const dataToSave: RPMData = {
      date: new Date(),
      rpm: rpmData,
      duration: rpmData.length,
      average: avg,
      personName: 'Jano'
    };
    return this.http.post('https://rpmbackend.herokuapp.com/create', dataToSave, httpOptions);
  }
  getTrainings() {
    return this.http.get<RPMData[]>('https://rpmbackend.herokuapp.com/all');
  }
}
