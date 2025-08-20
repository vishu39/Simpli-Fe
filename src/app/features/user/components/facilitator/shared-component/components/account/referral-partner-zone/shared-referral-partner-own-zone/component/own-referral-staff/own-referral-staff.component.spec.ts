import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnReferralStaffComponent } from './own-referral-staff.component';

describe('OwnReferralStaffComponent', () => {
  let component: OwnReferralStaffComponent;
  let fixture: ComponentFixture<OwnReferralStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnReferralStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnReferralStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
