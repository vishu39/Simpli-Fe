import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReferralPartnerPreStaffComponent } from "./referral-partner-pre-staff.component";

describe("ReferralPartnerPreStaffComponent", () => {
  let component: ReferralPartnerPreStaffComponent;
  let fixture: ComponentFixture<ReferralPartnerPreStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferralPartnerPreStaffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReferralPartnerPreStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
