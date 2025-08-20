import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageContentHospitalComponent } from './message-content-hospital.component';

describe('MessageContentHospitalComponent', () => {
  let component: MessageContentHospitalComponent;
  let fixture: ComponentFixture<MessageContentHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageContentHospitalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageContentHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
