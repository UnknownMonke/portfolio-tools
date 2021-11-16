import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorExposureComponent } from './sector-exposure.component';

describe('SectorExposureComponent', () => {
  let component: SectorExposureComponent;
  let fixture: ComponentFixture<SectorExposureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectorExposureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorExposureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
