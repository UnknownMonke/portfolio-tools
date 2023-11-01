import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, NgModule, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { NavigationService } from "src/app/core/services/navigation.service";

/**
 * Presentational component to display the page title according to the route.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  readonly title$: Observable<string>;

  constructor(
    private _navigationService: NavigationService
  ) {
    this.title$ = this._navigationService.title$();
  }

  ngOnInit(): void {
    this._navigationService.loadTitle();
  }
}

// ------------------------------------------------------------------------------------------------------------------------ //

@NgModule({
  declarations: [TitleComponent],
  exports: [TitleComponent],
  imports: [
    CommonModule
  ]
})
export class TitleModule {}
