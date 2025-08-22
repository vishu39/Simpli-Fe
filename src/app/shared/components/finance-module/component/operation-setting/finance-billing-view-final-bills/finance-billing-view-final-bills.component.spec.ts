import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceBillingViewFinalBillsComponent } from './finance-billing-view-final-bills.component';

describe('FinanceBillingViewFinalBillsComponent', () => {
  let component: FinanceBillingViewFinalBillsComponent;
  let fixture: ComponentFixture<FinanceBillingViewFinalBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceBillingViewFinalBillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceBillingViewFinalBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
