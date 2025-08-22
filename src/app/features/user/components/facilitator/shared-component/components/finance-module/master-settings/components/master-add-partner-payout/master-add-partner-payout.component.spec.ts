import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAddPartnerPayoutComponent } from './master-add-partner-payout.component';

describe('MasterAddPartnerPayoutComponent', () => {
  let component: MasterAddPartnerPayoutComponent;
  let fixture: ComponentFixture<MasterAddPartnerPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterAddPartnerPayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterAddPartnerPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
