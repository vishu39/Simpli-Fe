import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceBillingViewEstimateBillsComponent } from './finance-billing-view-estimate-bills.component';

describe('FinanceBillingViewEstimateBillsComponent', () => {
  let component: FinanceBillingViewEstimateBillsComponent;
  let fixture: ComponentFixture<FinanceBillingViewEstimateBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceBillingViewEstimateBillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceBillingViewEstimateBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
