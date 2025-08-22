import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceBillingViewDocBillsComponent } from './finance-billing-view-doc-bills.component';

describe('FinanceBillingViewDocBillsComponent', () => {
  let component: FinanceBillingViewDocBillsComponent;
  let fixture: ComponentFixture<FinanceBillingViewDocBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceBillingViewDocBillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceBillingViewDocBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
