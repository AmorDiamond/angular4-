import { Component, OnInit } from '@angular/core';
import { canvas } from './forecast-canvas.server.js';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {

  step = 'first';
  progressNumber = 0;
  isProgressEnd = false;
  constructor() { }

  ngOnInit() {
  }

  changeStep(step: string) {
    this.step = step;
    if (step === 'seconed') {
      setTimeout(() => {
        canvas('canvas');
        this.changeProgressNumber();
      }, 20);
    }
  }

  changeProgressNumber() {
    const timer = setInterval(() => {
      this.progressNumber += 1;
      if (this.progressNumber === 100) {
        clearInterval(timer);
        this.isProgressEnd = true;
        setTimeout(() => {
          this.step = 'third';
        }, 750);
      }
    }, 10);
  }

}
