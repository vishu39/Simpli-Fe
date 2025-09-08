import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceBillingViewHospitalUhidComponent } from './finance-billing-view-hospital-uhid.component';

describe('FinanceBillingViewHospitalUhidComponent', () => {
  let component: FinanceBillingViewHospitalUhidComponent;
  let fixture: ComponentFixture<FinanceBillingViewHospitalUhidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceBillingViewHospitalUhidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceBillingViewHospitalUhidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
