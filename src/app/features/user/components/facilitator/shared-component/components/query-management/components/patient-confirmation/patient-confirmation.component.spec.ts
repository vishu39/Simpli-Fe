import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientConfirmationComponent } from './patient-confirmation.component';

describe('PatientConfirmationComponent', () => {
  let component: PatientConfirmationComponent;
  let fixture: ComponentFixture<PatientConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
