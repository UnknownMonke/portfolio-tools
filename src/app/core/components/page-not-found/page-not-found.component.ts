import { ChangeDetectionStrategy, Component, NgModule, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

/**
 * Presentational component to handle 404 errors.
 *
 * ---
 *
 * Handles page-not-found error upon navigating to a non existing URL.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  private _message: string = 'Oops: the page you\'re looking for doesn\'t exists !';

  constructor(
    private _messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Uses PrimeNG Toast component to directly display a popup message.
    this._messageService.add({ key: 'main', severity: 'error', summary: 'Error', detail: this._message });
  }
}

@NgModule({
  declarations: [PageNotFoundComponent],
  exports: [PageNotFoundComponent],
  providers: [MessageService]
})
export class PageNotFoundModule {}
