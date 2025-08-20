import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReferralPartnerOwnStaffComponent } from './add-referral-partner-own-staff.component';

describe('AddReferralPartnerOwnStaffComponent', () => {
  let component: AddReferralPartnerOwnStaffComponent;
  let fixture: ComponentFixture<AddReferralPartnerOwnStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReferralPartnerOwnStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReferralPartnerOwnStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
