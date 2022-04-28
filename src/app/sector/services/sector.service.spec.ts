import { TestBed } from '@angular/core/testing';

import { SectorApiService } from './sector.service';

describe('SectorApiService', () => {
  let service: SectorApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectorApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
