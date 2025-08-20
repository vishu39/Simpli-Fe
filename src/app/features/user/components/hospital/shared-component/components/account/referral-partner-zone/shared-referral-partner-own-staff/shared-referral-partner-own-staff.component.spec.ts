import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedReferralPartnerOwnStaffComponent } from './shared-referral-partner-own-staff.component';

describe('SharedReferralPartnerOwnStaffComponent', () => {
  let component: SharedReferralPartnerOwnStaffComponent;
  let fixture: ComponentFixture<SharedReferralPartnerOwnStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedReferralPartnerOwnStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedReferralPartnerOwnStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
