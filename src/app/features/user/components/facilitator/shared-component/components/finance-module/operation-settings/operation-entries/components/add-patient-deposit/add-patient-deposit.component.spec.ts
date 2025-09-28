import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientDepositComponent } from './add-patient-deposit.component';

describe('AddPatientDepositComponent', () => {
  let component: AddPatientDepositComponent;
  let fixture: ComponentFixture<AddPatientDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPatientDepositComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPatientDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
