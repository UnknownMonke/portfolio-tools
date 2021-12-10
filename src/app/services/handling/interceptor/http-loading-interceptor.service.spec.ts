import { TestBed } from '@angular/core/testing';

import { HttpLoadingInterceptor } from './http-loading-interceptor.service';

describe('HttpLoadingInterceptor', () => {
  let service: HttpLoadingInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpLoadingInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
