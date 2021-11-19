import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographicGraphComponent } from './geographic-graph.component';

describe('GeographicGraphComponent', () => {
  let component: GeographicGraphComponent;
  let fixture: ComponentFixture<GeographicGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeographicGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeographicGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
