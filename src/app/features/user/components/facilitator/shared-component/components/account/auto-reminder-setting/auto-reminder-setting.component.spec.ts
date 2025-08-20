import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoReminderSettingComponent } from './auto-reminder-setting.component';

describe('AutoReminderSettingComponent', () => {
  let component: AutoReminderSettingComponent;
  let fixture: ComponentFixture<AutoReminderSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoReminderSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoReminderSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
