import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientConfirmationDetailsComponent } from './add-patient-confirmation-details.component';

describe('AddPatientConfirmationDetailsComponent', () => {
  let component: AddPatientConfirmationDetailsComponent;
  let fixture: ComponentFixture<AddPatientConfirmationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPatientConfirmationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPatientConfirmationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
