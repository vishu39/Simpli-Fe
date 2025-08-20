import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFetchAssignConfirmationComponent } from './message-fetch-assign-confirmation.component';

describe('MessageFetchAssignConfirmationComponent', () => {
  let component: MessageFetchAssignConfirmationComponent;
  let fixture: ComponentFixture<MessageFetchAssignConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFetchAssignConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFetchAssignConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
