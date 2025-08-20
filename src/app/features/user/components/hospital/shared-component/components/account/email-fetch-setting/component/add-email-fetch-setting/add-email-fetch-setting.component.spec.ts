import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmailFetchSettingComponent } from './add-email-fetch-setting.component';

describe('AddEmailFetchSettingComponent', () => {
  let component: AddEmailFetchSettingComponent;
  let fixture: ComponentFixture<AddEmailFetchSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEmailFetchSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEmailFetchSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
