import { ChangeDetectionStrategy, Component, Input, NgModule, ViewChild } from "@angular/core";
import { TieredMenuModule as PrimeTieredMenuModule, TieredMenu } from 'primeng/tieredmenu';
import { MenuItem } from "../../models/menuitem";

/**
 * Presentational tiered menu component.
 *
 * ---
 *
 * Encapsulates the PrimeNG component.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tiered-menu',
  templateUrl: './tiered-menu.component.html'
})
export class TieredMenuComponent {

  @Input() menuItems: MenuItem[] = [];

  @ViewChild('menu') menu: TieredMenu;

  constructor(
    private _elementRef: TieredMenu
  ) {
    this.menu = this._elementRef;
  }

  toggle(event: Event): void {
    this.menu.toggle(event);
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [TieredMenuComponent],
  exports: [TieredMenuComponent],
  imports: [
    PrimeTieredMenuModule
  ],
  providers: [TieredMenu]
})
export class TieredMenuModule {}
