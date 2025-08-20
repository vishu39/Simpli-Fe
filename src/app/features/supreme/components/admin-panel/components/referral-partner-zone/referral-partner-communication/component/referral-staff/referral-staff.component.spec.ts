import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralStaffComponent } from './referral-staff.component';

describe('ReferralStaffComponent', () => {
  let component: ReferralStaffComponent;
  let fixture: ComponentFixture<ReferralStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
