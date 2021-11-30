import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographyEditComponent } from './geography-edit.component';

describe('GeographyEditComponent', () => {
  let component: GeographyEditComponent;
  let fixture: ComponentFixture<GeographyEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeographyEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeographyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
