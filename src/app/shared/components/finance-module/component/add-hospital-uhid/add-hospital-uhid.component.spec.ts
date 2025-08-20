import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHospitalUhidComponent } from './add-hospital-uhid.component';

describe('AddHospitalUhidComponent', () => {
  let component: AddHospitalUhidComponent;
  let fixture: ComponentFixture<AddHospitalUhidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHospitalUhidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHospitalUhidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
