import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoMappingComponent } from './geo-mapping.component';

describe('GeoMappingComponent', () => {
  let component: GeoMappingComponent;
  let fixture: ComponentFixture<GeoMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
