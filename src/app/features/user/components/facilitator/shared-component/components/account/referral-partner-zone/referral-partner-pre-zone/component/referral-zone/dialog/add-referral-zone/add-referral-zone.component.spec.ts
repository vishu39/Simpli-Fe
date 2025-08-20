import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReferralZoneComponent } from './add-referral-zone.component';

describe('AddReferralZoneComponent', () => {
  let component: AddReferralZoneComponent;
  let fixture: ComponentFixture<AddReferralZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReferralZoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReferralZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
