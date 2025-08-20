import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSentSettingComponent } from './email-sent-setting.component';

describe('EmailSentSettingComponent', () => {
  let component: EmailSentSettingComponent;
  let fixture: ComponentFixture<EmailSentSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailSentSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailSentSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
