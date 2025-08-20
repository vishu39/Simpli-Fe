import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFetchAddPatientComponent } from './message-fetch-add-patient.component';

describe('MessageFetchAddPatientComponent', () => {
  let component: MessageFetchAddPatientComponent;
  let fixture: ComponentFixture<MessageFetchAddPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFetchAddPatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFetchAddPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
