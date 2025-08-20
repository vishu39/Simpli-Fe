import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOwnReferralPartnerZoneComponent } from './add-own-referral-partner-zone.component';

describe('AddOwnReferralPartnerZoneComponent', () => {
  let component: AddOwnReferralPartnerZoneComponent;
  let fixture: ComponentFixture<AddOwnReferralPartnerZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOwnReferralPartnerZoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOwnReferralPartnerZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
