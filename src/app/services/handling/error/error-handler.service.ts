import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MessageService } from 'primeng/api';

/** Service de gestion d'erreur et d'affichage. */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
    private messageService: MessageService,
    private zone: NgZone
  ) {}

  handleError(error: any): void {
    // TODO: send the error to remote logging infrastructure
    console.log(error);

    // Affiche un message à l'utilisateur.
    this.zone.run(() =>
      this.messageService.add({ key: 'main', severity: 'error', summary: 'Error', detail: error.message ? error.message : 'An Error has occurred' })
    );
  }
}
