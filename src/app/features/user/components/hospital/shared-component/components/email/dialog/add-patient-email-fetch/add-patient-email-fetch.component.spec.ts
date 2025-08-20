import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientEmailFetchComponent } from './add-patient-email-fetch.component';

describe('AddPatientEmailFetchComponent', () => {
  let component: AddPatientEmailFetchComponent;
  let fixture: ComponentFixture<AddPatientEmailFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPatientEmailFetchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPatientEmailFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
