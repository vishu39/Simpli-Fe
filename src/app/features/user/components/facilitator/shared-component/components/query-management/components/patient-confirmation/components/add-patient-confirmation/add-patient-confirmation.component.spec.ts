import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientConfirmationComponent } from './add-patient-confirmation.component';

describe('AddPatientConfirmationComponent', () => {
  let component: AddPatientConfirmationComponent;
  let fixture: ComponentFixture<AddPatientConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPatientConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPatientConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
