import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReproductorService {
  constructor() {}

  public secondsToString(seconds: number) {
    let time = '';
    const minute = Math.floor((seconds / 60) % 60);
    if (minute < 10) {
      time += '0' + minute.toString() + ':';
    } else {
      time += minute.toString() + ':';
    }
    const second = seconds % 60;
    if (second < 10) {
      time += '0' + Math.trunc(second).toString();
    } else {
      time += Math.trunc(second).toString();
    }
    return time;
  }
}
