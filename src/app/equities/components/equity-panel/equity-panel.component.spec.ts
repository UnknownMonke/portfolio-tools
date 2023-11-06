import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquityPanelComponent } from './equity-panel.component';

describe('EquityViewComponent', () => {
  let component: EquityPanelComponent;
  let fixture: ComponentFixture<EquityPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquityPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquityPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
