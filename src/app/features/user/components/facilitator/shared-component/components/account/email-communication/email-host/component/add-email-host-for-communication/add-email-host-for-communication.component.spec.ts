import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmailHostForCommunicationComponent } from './add-email-host-for-communication.component';

describe('AddEmailHostForCommunicationComponent', () => {
  let component: AddEmailHostForCommunicationComponent;
  let fixture: ComponentFixture<AddEmailHostForCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmailHostForCommunicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmailHostForCommunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
