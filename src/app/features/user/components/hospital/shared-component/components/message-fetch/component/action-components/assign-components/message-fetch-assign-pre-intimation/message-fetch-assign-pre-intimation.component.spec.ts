import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFetchAssignPreIntimationComponent } from './message-fetch-assign-pre-intimation.component';

describe('MessageFetchAssignPreIntimationComponent', () => {
  let component: MessageFetchAssignPreIntimationComponent;
  let fixture: ComponentFixture<MessageFetchAssignPreIntimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFetchAssignPreIntimationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFetchAssignPreIntimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
