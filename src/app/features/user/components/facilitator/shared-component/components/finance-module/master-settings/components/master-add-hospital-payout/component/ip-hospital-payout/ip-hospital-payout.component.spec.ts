import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpHospitalPayoutComponent } from './ip-hospital-payout.component';

describe('IpHospitalPayoutComponent', () => {
  let component: IpHospitalPayoutComponent;
  let fixture: ComponentFixture<IpHospitalPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IpHospitalPayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IpHospitalPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
