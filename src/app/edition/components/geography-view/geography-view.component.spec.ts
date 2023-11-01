import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographyViewComponent } from './geography-view.component';

describe('GeoMappingComponent', () => {
  let component: GeographyViewComponent;
  let fixture: ComponentFixture<GeographyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeographyViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeographyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
