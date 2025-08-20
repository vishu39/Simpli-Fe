import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnReferralDefaultEmailComponent } from './own-referral-default-email.component';

describe('OwnReferralDefaultEmailComponent', () => {
  let component: OwnReferralDefaultEmailComponent;
  let fixture: ComponentFixture<OwnReferralDefaultEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnReferralDefaultEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnReferralDefaultEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
