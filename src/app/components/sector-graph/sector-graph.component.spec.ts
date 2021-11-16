import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorGraphComponent } from './sector-graph.component';

describe('SectorGraphComponent', () => {
  let component: SectorGraphComponent;
  let fixture: ComponentFixture<SectorGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectorGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
