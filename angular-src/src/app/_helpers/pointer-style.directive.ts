import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  //selector: '[appPointerStyle]'
  selector: '[click]'
})
export class PointerStyleDirective {

  constructor(private el: ElementRef) { }

  @HostBinding('style.cursor') cursor: string = 'pointer';

}
