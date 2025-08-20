import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFetchAssignOpinionComponent } from './message-fetch-assign-opinion.component';

describe('MessageFetchAssignOpinionComponent', () => {
  let component: MessageFetchAssignOpinionComponent;
  let fixture: ComponentFixture<MessageFetchAssignOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFetchAssignOpinionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFetchAssignOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
