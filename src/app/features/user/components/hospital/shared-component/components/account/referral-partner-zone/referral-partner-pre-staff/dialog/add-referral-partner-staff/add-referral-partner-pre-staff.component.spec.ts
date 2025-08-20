import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AddReferralPartnerPreStaffComponent } from "./add-referral-partner-pre-staff.component";

describe("AddReferralPartnerPreStaffComponent", () => {
  let component: AddReferralPartnerPreStaffComponent;
  let fixture: ComponentFixture<AddReferralPartnerPreStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddReferralPartnerPreStaffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddReferralPartnerPreStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
