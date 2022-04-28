import { TestBed } from '@angular/core/testing';

import { GeographyApiService } from './geography-api.service';

describe('GeographyApiService', () => {
  let service: GeographyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeographyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
