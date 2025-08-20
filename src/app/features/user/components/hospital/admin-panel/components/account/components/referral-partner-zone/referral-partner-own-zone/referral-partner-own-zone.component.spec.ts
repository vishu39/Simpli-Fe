import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralPartnerOwnZoneComponent } from './referral-partner-own-zone.component';

describe('ReferralPartnerOwnZoneComponent', () => {
  let component: ReferralPartnerOwnZoneComponent;
  let fixture: ComponentFixture<ReferralPartnerOwnZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralPartnerOwnZoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralPartnerOwnZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
