import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

/**
 * Handles page-not-found error upon navigating to a non existing URL.
 *
 * ---
 *
 * Display only.
 */
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  message: string = 'Page not found.';

  constructor(
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Uses PrimeNG Toast component to directly display a popup message.
    this.messageService.add({ key: 'main', severity: 'error', summary: 'Error', detail: this.message });
  }
}
