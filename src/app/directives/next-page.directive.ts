import { Directive, HostListener } from '@angular/core';
import { Location } from '@angular/common';

/**
 * Directive de retour avant en navigation.
 */
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
