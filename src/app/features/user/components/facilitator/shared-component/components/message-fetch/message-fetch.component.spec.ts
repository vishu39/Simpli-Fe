import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFetchComponent } from './message-fetch.component';

describe('MessageFetchComponent', () => {
  let component: MessageFetchComponent;
  let fixture: ComponentFixture<MessageFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFetchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
