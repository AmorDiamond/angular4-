import { Directive, forwardRef, Attribute, ElementRef, Input, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appHasPromission]',
})

export class HasPromissionDirective implements OnInit {

  @Input() urlAndMethod: string;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    if (this.urlAndMethod === 'URLANDMETHOD') {
      this.el.nativeElement.style.display = 'none';
    }
  }

}
