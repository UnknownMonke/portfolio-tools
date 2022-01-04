import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorExposureTableComponent } from './sector-exposure-table.component';

describe('SectorExposureTableComponent', () => {
  let component: SectorExposureTableComponent;
  let fixture: ComponentFixture<SectorExposureTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectorExposureTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorExposureTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
