import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReferralPartnerStaffComponent } from './add-referral-partner-staff.component';

describe('AddReferralPartnerStaffComponent', () => {
  let component: AddReferralPartnerStaffComponent;
  let fixture: ComponentFixture<AddReferralPartnerStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReferralPartnerStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReferralPartnerStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
