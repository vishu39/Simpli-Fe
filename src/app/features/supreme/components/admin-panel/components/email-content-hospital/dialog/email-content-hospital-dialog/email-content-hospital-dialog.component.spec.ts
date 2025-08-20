import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailContentHospitalDialogComponent } from './email-content-hospital-dialog.component';

describe('EmailContentHospitalDialogComponent', () => {
  let component: EmailContentHospitalDialogComponent;
  let fixture: ComponentFixture<EmailContentHospitalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailContentHospitalDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailContentHospitalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
