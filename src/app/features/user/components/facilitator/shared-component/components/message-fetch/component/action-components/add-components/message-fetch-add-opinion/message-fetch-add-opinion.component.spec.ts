import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFetchAddOpinionComponent } from './message-fetch-add-opinion.component';

describe('MessageFetchAddOpinionComponent', () => {
  let component: MessageFetchAddOpinionComponent;
  let fixture: ComponentFixture<MessageFetchAddOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFetchAddOpinionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFetchAddOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
