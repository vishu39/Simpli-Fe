import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedReferralPartnerOwnZoneComponent } from './shared-referral-partner-own-zone.component';

describe('SharedReferralPartnerOwnZoneComponent', () => {
  let component: SharedReferralPartnerOwnZoneComponent;
  let fixture: ComponentFixture<SharedReferralPartnerOwnZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedReferralPartnerOwnZoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedReferralPartnerOwnZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
