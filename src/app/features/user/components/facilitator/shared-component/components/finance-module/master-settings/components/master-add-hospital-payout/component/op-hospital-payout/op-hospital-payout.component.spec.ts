import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpHospitalPayoutComponent } from './op-hospital-payout.component';

describe('OpHospitalPayoutComponent', () => {
  let component: OpHospitalPayoutComponent;
  let fixture: ComponentFixture<OpHospitalPayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpHospitalPayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpHospitalPayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
