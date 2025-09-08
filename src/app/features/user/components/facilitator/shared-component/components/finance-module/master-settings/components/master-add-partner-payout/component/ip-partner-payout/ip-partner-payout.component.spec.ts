import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpPartnerPayoutComponent } from './ip-partner-payout.component';

describe('IpPartnerPayoutComponent', () => {
  let component: IpPartnerPayoutComponent;
  let fixture: ComponentFixture<IpPartnerPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IpPartnerPayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IpPartnerPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
