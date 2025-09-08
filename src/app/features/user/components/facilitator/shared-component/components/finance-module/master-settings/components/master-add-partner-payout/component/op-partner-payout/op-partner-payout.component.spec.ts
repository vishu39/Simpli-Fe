import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpPartnerPayoutComponent } from './op-partner-payout.component';

describe('OpPartnerPayoutComponent', () => {
  let component: OpPartnerPayoutComponent;
  let fixture: ComponentFixture<OpPartnerPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpPartnerPayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpPartnerPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
