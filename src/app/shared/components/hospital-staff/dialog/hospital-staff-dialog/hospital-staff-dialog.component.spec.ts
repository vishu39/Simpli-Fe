import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalStaffDialogComponent } from './hospital-staff-dialog.component';

describe('HospitalStaffDialogComponent', () => {
  let component: HospitalStaffDialogComponent;
  let fixture: ComponentFixture<HospitalStaffDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalStaffDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalStaffDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
