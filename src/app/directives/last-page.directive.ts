import { Directive, HostListener } from '@angular/core';
import { Location } from '@angular/common';

//retour arrière en navigation
@Directive({
  selector: '[appLastPage]'
})
export class LastPageDirective {

  constructor(
    private location: Location
  ) {}

  @HostListener('click')
  onClick(): void {
    this.location.back();
  }

}
