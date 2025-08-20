import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFetchAssignVilComponent } from './message-fetch-assign-vil.component';

describe('MessageFetchAssignVilComponent', () => {
  let component: MessageFetchAssignVilComponent;
  let fixture: ComponentFixture<MessageFetchAssignVilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFetchAssignVilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFetchAssignVilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
