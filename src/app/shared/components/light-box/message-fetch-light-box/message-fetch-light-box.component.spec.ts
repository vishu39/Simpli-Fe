import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFetchLightBoxComponent } from './message-fetch-light-box.component';

describe('MessageFetchLightBoxComponent', () => {
  let component: MessageFetchLightBoxComponent;
  let fixture: ComponentFixture<MessageFetchLightBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFetchLightBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFetchLightBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
