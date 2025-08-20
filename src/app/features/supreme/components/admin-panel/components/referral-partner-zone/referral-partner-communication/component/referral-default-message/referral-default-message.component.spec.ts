import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralDefaultMessageComponent } from './referral-default-message.component';

describe('ReferralDefaultMessageComponent', () => {
  let component: ReferralDefaultMessageComponent;
  let fixture: ComponentFixture<ReferralDefaultMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralDefaultMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralDefaultMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
