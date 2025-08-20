import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralPartnerDetailsComponent } from './referral-partner-details.component';

describe('ReferralPartnerDetailsComponent', () => {
  let component: ReferralPartnerDetailsComponent;
  let fixture: ComponentFixture<ReferralPartnerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralPartnerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralPartnerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
