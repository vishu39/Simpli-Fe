import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnReferralDefaultMessageComponent } from './own-referral-default-message.component';

describe('OwnReferralDefaultMessageComponent', () => {
  let component: OwnReferralDefaultMessageComponent;
  let fixture: ComponentFixture<OwnReferralDefaultMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnReferralDefaultMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnReferralDefaultMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
