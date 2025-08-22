import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAddHospitalPayoutComponent } from './master-add-hospital-payout.component';

describe('MasterAddHospitalPayoutComponent', () => {
  let component: MasterAddHospitalPayoutComponent;
  let fixture: ComponentFixture<MasterAddHospitalPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterAddHospitalPayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterAddHospitalPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
