import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowupSettingComponent } from './followup-setting.component';

describe('FollowupSettingComponent', () => {
  let component: FollowupSettingComponent;
  let fixture: ComponentFixture<FollowupSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowupSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowupSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
