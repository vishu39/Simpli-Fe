import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSettingPartnerFilterDialogComponent } from './master-setting-partner-filter-dialog.component';

describe('MasterSettingPartnerFilterDialogComponent', () => {
  let component: MasterSettingPartnerFilterDialogComponent;
  let fixture: ComponentFixture<MasterSettingPartnerFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterSettingPartnerFilterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterSettingPartnerFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
