import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesPartnerPayoutComponent } from './packages-partner-payout.component';

describe('PackagesPartnerPayoutComponent', () => {
  let component: PackagesPartnerPayoutComponent;
  let fixture: ComponentFixture<PackagesPartnerPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackagesPartnerPayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesPartnerPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
