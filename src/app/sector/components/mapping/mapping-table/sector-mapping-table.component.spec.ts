import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorMappingTableComponent } from './sector-mapping-table.component';

describe('SectorMappingTableComponent', () => {
  let component: SectorMappingTableComponent;
  let fixture: ComponentFixture<SectorMappingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectorMappingTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorMappingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
