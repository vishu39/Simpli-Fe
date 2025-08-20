import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFetchAssignOpdComponent } from './message-fetch-assign-opd.component';

describe('MessageFetchAssignOpdComponent', () => {
  let component: MessageFetchAssignOpdComponent;
  let fixture: ComponentFixture<MessageFetchAssignOpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFetchAssignOpdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFetchAssignOpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
