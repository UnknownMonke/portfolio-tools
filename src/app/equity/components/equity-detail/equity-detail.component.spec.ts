import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquityDetailComponent } from './equity-detail.component';

describe('EquityDetailComponent', () => {
  let component: EquityDetailComponent;
  let fixture: ComponentFixture<EquityDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquityDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
