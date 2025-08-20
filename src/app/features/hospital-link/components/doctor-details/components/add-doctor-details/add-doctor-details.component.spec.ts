import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoctorDetailsComponent } from './add-doctor-details.component';

describe('AddDoctorDetailsComponent', () => {
  let component: AddDoctorDetailsComponent;
  let fixture: ComponentFixture<AddDoctorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDoctorDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDoctorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
