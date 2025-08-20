import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFetchActionComponent } from './message-fetch-action.component';

describe('MessageFetchActionComponent', () => {
  let component: MessageFetchActionComponent;
  let fixture: ComponentFixture<MessageFetchActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFetchActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFetchActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
