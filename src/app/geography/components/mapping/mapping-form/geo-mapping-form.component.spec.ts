import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoMappingFormComponent } from './geo-mapping-form.component';

describe('GeoMappingFormComponent', () => {
  let component: GeoMappingFormComponent;
  let fixture: ComponentFixture<GeoMappingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoMappingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoMappingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
