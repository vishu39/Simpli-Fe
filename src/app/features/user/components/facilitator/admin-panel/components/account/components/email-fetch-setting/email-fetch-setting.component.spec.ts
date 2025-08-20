import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFetchSettingComponent } from './email-fetch-setting.component';

describe('EmailFetchSettingComponent', () => {
  let component: EmailFetchSettingComponent;
  let fixture: ComponentFixture<EmailFetchSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailFetchSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailFetchSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
