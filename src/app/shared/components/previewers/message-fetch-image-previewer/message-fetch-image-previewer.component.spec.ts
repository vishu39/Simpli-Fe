import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFetchImagePreviewerComponent } from './message-fetch-image-previewer.component';

describe('MessageFetchImagePreviewerComponent', () => {
  let component: MessageFetchImagePreviewerComponent;
  let fixture: ComponentFixture<MessageFetchImagePreviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFetchImagePreviewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFetchImagePreviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
