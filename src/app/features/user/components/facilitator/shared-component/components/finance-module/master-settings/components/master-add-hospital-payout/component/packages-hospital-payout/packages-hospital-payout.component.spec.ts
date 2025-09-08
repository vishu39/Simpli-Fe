import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesHospitalPayoutComponent } from './packages-hospital-payout.component';

describe('PackagesHospitalPayoutComponent', () => {
  let component: PackagesHospitalPayoutComponent;
  let fixture: ComponentFixture<PackagesHospitalPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackagesHospitalPayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesHospitalPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
