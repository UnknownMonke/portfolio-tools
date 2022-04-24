import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExposureGraphComponent } from './exposure-graph.component';

describe('ExposureGraphComponent', () => {
  let component: ExposureGraphComponent;
  let fixture: ComponentFixture<ExposureGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExposureGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExposureGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
