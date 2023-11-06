import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquityViewComponent } from './equity-view.component';

describe('EquityViewComponent', () => {
  let component: EquityViewComponent;
  let fixture: ComponentFixture<EquityViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquityViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
