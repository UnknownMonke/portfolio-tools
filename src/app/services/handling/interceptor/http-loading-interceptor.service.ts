import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { TokenStorageService } from '../../auth/token-storage.service';
import { LoadingService } from '../loading/loading.service';


const TOKEN_HEADER_KEY = 'x-access-token'; // Used for Node server.

/**
 * Intercepteur Http.
 *
 * - Déclenche le loader pour chaque requête Http.
 * - Ajout du token user dans chaque requête.
 */
//TODO test avec serveur arrété
@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {

  totalRequests: number = 0;
  completedRequests: number = 0;

  constructor(
    private loadingService: LoadingService,
    private tokenStorageService: TokenStorageService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Loading.
    this.loadingService.setLoading(true);
    this.totalRequests++;

    let authReq: HttpRequest<any> = this.addToken(req);

    // Object retourné: la réponse.
    return next.handle(authReq)
      .pipe(
        tap(event => {
          if(event instanceof HttpResponse) {
            //console.log(event);
          }
        }),
        catchError((error) => {
          return of();
        }),
        finalize(() => {
          this.completedRequests++;

          if(this.completedRequests === this.totalRequests) {
            this.totalRequests = 0;
            this.completedRequests = 0;
            this.loadingService.setLoading(false);
          }
        })
      );
  }

  // Clone la requête pour ajouter le token d'identification.
  private addToken(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.tokenStorageService.getToken();

    if(token != null) {
      return req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, token)});
    }
    return req;
  }
}
