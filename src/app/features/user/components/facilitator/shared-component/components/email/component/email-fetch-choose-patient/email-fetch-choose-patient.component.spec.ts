import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFetchChoosePatientComponent } from './email-fetch-choose-patient.component';

describe('EmailFetchChoosePatientComponent', () => {
  let component: EmailFetchChoosePatientComponent;
  let fixture: ComponentFixture<EmailFetchChoosePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailFetchChoosePatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailFetchChoosePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
