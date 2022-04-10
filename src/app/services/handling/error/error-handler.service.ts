import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MessageService } from 'primeng/api';

/**
 * Errors and exceptions handling service.
 *
 * This service acts as an interceptor for all errors thrown in the application,
 * which allows for custom message display using PrimeNG Toast.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  displayMessage: string = '';

  constructor(
    private messageService: MessageService,
    private zone: NgZone
  ) {}

  // TODO: logging with ELK
  /**
   * Error interceptor function, overrides ErrorHandler one.
   *
   * Actions :
   * - Displays the error back to the user through PrimeNG Toast (custom message service with HTML popup).
   */
  handleError(error: any): void {

    // Allows for taking care of multiple error and exception types. Can be extended.
    if( error instanceof Error) {
      this.displayMessage = error.message;
    } else {
      this.displayMessage = 'An Error has occurred';
    }

    // The zone allows for asynchronous processing of errors outside Angular zone, then injecting them back at runtime.
    this.zone.run(() =>
      this.messageService.add({ key: 'main', severity: 'error', summary: 'Error', detail: this.displayMessage })
    );
  }
}
