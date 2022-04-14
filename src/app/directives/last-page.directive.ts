import { Directive, HostListener } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
  selector: '[appLastPage]'
})
export class LastPageDirective {

  constructor(
    private location: Location
  ) {}

  @HostListener('click')
  onClick(): void {
    // location is the current URL, can be navigated forward and back based on the History API.
    this.location.back();
  }
}
