import { TestBed } from '@angular/core/testing';

import { HttpCustomInterceptor } from './http-custom-interceptor.service';

describe('HttpLoadingInterceptor', () => {
  let service: HttpCustomInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpCustomInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
