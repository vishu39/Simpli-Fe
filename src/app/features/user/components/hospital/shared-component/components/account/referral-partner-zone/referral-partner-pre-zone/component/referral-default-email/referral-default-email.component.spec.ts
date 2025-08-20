import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralDefaultEmailComponent } from './referral-default-email.component';

describe('ReferralDefaultEmailComponent', () => {
  let component: ReferralDefaultEmailComponent;
  let fixture: ComponentFixture<ReferralDefaultEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralDefaultEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralDefaultEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
