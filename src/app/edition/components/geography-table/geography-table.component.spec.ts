import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoMappingTableComponent } from './geography-table.component';

describe('GeoMappingTableComponent', () => {
  let component: GeoMappingTableComponent;
  let fixture: ComponentFixture<GeoMappingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoMappingTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoMappingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
