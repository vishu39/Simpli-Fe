import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnReferralZoneComponent } from './own-referral-zone.component';

describe('OwnReferralZoneComponent', () => {
  let component: OwnReferralZoneComponent;
  let fixture: ComponentFixture<OwnReferralZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnReferralZoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnReferralZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
