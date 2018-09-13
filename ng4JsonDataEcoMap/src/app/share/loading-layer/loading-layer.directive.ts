import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appLoadingLayer]'
})
export class LoadingLayerDirective {

  el: ElementRef;
  constructor(el: ElementRef) {
    this.el = el;
  }

}
