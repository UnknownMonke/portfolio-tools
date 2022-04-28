import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorMappingFormComponent } from './sector-mapping-form.component';

describe('SectorMappingFormComponent', () => {
  let component: SectorMappingFormComponent;
  let fixture: ComponentFixture<SectorMappingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectorMappingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorMappingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
