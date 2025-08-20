import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralPartnerCommunicationComponent } from './referral-partner-communication.component';

describe('ReferralPartnerCommunicationComponent', () => {
  let component: ReferralPartnerCommunicationComponent;
  let fixture: ComponentFixture<ReferralPartnerCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralPartnerCommunicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralPartnerCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
