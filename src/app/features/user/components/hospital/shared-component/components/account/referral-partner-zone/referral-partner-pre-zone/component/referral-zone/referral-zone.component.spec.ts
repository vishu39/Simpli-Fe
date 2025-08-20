import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralZoneComponent } from './referral-zone.component';

describe('ReferralZoneComponent', () => {
  let component: ReferralZoneComponent;
  let fixture: ComponentFixture<ReferralZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralZoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
