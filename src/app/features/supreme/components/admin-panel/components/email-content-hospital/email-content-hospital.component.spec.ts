import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailContentHospitalComponent } from './email-content-hospital.component';

describe('EmailContentHospitalComponent', () => {
  let component: EmailContentHospitalComponent;
  let fixture: ComponentFixture<EmailContentHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailContentHospitalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailContentHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
