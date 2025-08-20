import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralPartnerOwnStaffComponent } from './referral-partner-own-staff.component';

describe('ReferralPartnerOwnStaffComponent', () => {
  let component: ReferralPartnerOwnStaffComponent;
  let fixture: ComponentFixture<ReferralPartnerOwnStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralPartnerOwnStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralPartnerOwnStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
