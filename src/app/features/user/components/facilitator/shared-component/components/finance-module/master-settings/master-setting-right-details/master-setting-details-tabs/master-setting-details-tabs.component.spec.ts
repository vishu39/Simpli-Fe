import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSettingDetailsTabsComponent } from './master-setting-details-tabs.component';

describe('MasterSettingDetailsTabsComponent', () => {
  let component: MasterSettingDetailsTabsComponent;
  let fixture: ComponentFixture<MasterSettingDetailsTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterSettingDetailsTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterSettingDetailsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
