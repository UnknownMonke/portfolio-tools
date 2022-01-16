import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { LoadingService } from '../loading/loading.service';


/** Intercepteur Http. Gestion du loading */
//TODO test avec serveur arrété
@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {

  totalRequests: number = 0;
  completedRequests: number = 0;

  constructor(
    private loadingService: LoadingService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.loadingService.setLoading(true);
    this.totalRequests++;

    return next.handle(req)
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
}
