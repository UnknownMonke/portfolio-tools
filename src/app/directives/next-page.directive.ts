import { Directive, HostListener } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
  selector: '[appNextPage]'
})
export class NextPageDirective {

  constructor(
    private location: Location
  ) {}

  @HostListener('click')
  onClick(): void {
    this.location.forward();
  }
}
