import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographyMappingComponent } from './geography-mapping.component';

describe('GeographyMappingComponent', () => {
  let component: GeographyMappingComponent;
  let fixture: ComponentFixture<GeographyMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeographyMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeographyMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
