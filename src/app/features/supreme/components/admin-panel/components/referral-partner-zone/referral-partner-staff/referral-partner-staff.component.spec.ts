import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralPartnerStaffComponent } from './referral-partner-staff.component';

describe('ReferralPartnerStaffComponent', () => {
  let component: ReferralPartnerStaffComponent;
  let fixture: ComponentFixture<ReferralPartnerStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralPartnerStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralPartnerStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
