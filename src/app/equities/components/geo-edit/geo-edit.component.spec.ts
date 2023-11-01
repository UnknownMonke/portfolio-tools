import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoEditComponent } from './geo-edit.component';

describe('GeoEditComponent', () => {
  let component: GeoEditComponent;
  let fixture: ComponentFixture<GeoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
