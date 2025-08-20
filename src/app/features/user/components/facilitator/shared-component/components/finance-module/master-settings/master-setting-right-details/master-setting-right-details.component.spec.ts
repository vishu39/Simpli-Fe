import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSettingRightDetailsComponent } from './master-setting-right-details.component';

describe('MasterSettingRightDetailsComponent', () => {
  let component: MasterSettingRightDetailsComponent;
  let fixture: ComponentFixture<MasterSettingRightDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterSettingRightDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterSettingRightDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
