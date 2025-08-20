import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceBillingViewAdmissionTrackerDetailsComponent } from './finance-billing-view-admission-tracker-details.component';

describe('FinanceBillingViewAdmissionTrackerDetailsComponent', () => {
  let component: FinanceBillingViewAdmissionTrackerDetailsComponent;
  let fixture: ComponentFixture<FinanceBillingViewAdmissionTrackerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceBillingViewAdmissionTrackerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceBillingViewAdmissionTrackerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
