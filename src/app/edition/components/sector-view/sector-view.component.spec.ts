import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorMappingComponent } from './sector-view.component';

describe('SectorMappingComponent', () => {
  let component: SectorMappingComponent;
  let fixture: ComponentFixture<SectorMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectorMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
