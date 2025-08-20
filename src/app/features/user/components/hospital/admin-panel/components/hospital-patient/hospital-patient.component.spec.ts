import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalPatientComponent } from './hospital-patient.component';

describe('HospitalPatientComponent', () => {
  let component: HospitalPatientComponent;
  let fixture: ComponentFixture<HospitalPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalPatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
