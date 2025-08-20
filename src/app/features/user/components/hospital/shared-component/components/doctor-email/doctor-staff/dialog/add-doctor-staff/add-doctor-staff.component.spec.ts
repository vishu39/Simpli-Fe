import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoctorStaffComponent } from './add-doctor-staff.component';

describe('AddDoctorStaffComponent', () => {
  let component: AddDoctorStaffComponent;
  let fixture: ComponentFixture<AddDoctorStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDoctorStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDoctorStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
