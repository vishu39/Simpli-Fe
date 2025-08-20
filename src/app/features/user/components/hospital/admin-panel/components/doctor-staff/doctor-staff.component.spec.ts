import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorStaffComponent } from './doctor-staff.component';

describe('DoctorStaffComponent', () => {
  let component: DoctorStaffComponent;
  let fixture: ComponentFixture<DoctorStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
