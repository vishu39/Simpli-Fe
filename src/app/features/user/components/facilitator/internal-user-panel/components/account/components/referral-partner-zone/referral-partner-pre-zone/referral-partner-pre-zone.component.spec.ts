import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralPartnerPreZoneComponent } from './referral-partner-pre-zone.component';

describe('ReferralPartnerPreZoneComponent', () => {
  let component: ReferralPartnerPreZoneComponent;
  let fixture: ComponentFixture<ReferralPartnerPreZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralPartnerPreZoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralPartnerPreZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
