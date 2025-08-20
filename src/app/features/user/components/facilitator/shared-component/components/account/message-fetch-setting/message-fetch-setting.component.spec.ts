import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFetchSettingComponent } from './message-fetch-setting.component';

describe('MessageFetchSettingComponent', () => {
  let component: MessageFetchSettingComponent;
  let fixture: ComponentFixture<MessageFetchSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFetchSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFetchSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
