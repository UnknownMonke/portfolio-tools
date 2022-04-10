import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, Observable, of, tap, throwError } from 'rxjs';
import { SessionService } from '../../auth/session.service';
import { LoadingService } from '../loading/loading.service';

// Used in case of a Node Express server. Can change according to backend framework.
const TOKEN_HEADER_KEY = 'x-access-token';

/**
 * HTTP Interceptor.
 *
 * Actions :
 * - Triggers loader and loading spinner if the request takes some time, until all current requests are processed.
 * - If a token is present, adds the token to the request for server-side validation.
 * - Handles status codes and throws error to de displayed by the ErrorHandler.
 *
 * The loader is triggered everytime a request is made, until all active requests have either succeeded or failed.
 * We keep track of total requests currently sent, and total completed requests.
 *
 * Each new requests is added to the total request pool.
 * When the request completes, we add it to the completed request pool.
 *
 * When both pool are equal and all current requests have completed, we remove the loader and reset the counters.
 *
 * This allows for multiple requests from asynchronous sources to run with only one loader.
 */
@Injectable()
export class HttpCustomInterceptor implements HttpInterceptor {

  totalRequests: number = 0;
  completedRequests: number = 0;

  constructor(
    private loadingService: LoadingService,
    private sessionService: SessionService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Adds request to the total request pool.
    this.totalRequests++;

    // Adds the token to the requests if exists.
    let authReq: HttpRequest<any> = this.addToken(req);

    /*
    Activates loader if all requests are not completed after some time,
    long enough for most requests to complete, but fast enough for the user to not notice it.
    */
    setTimeout(() => {
      if(this.completedRequests !== this.totalRequests) {
        this.loadingService.setLoading(true);
      }
    }, 200); // ms.

    // Handles request.
    return next.handle(authReq)
      .pipe(
        tap(event => {
          if(event instanceof HttpResponse) {
            // Optional processing for responses.
            //TODO only displays 200 responses if header is application/json...
            //console.log(event)
          }
        }),
        // Error handler, called by default when status != 200.
        catchError((response) => {

          if(response instanceof HttpErrorResponse) {

            // Handles different statuses.
            switch(response.status) {
              case 0:
                throwError(() => new Error('Network error')).subscribe();
                break;
              case 404:
                throwError(() => new Error(response.error)).subscribe();
                break;
              default:
                throwError(() => new Error('An Error has occurred')).subscribe();
                break;
            }
          }
          return of(); // Returns an empty Observable, no data will be received by the corresponding service upon subscription.
        }),
        // Always called upon source completion, error or end of subscription.
        finalize(() => {
          this.completedRequests++;

          // Resets counters, removes loader.
          if(this.completedRequests === this.totalRequests) {
            this.totalRequests = 0;
            this.completedRequests = 0;
            this.loadingService.setLoading(false);
          }
        })
      );
  }

  /**
   * Adds a token if exists, by cloning the request.
   *
   * @returns The original request if no token is present, or a cloned request containing the token as header.
   */
  private addToken(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.sessionService.getToken();

    if(token != null) {
      return req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, token) });
    }
    return req;
  }
}
