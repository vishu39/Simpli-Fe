import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSettingHospitalFilterDialogComponent } from './master-setting-hospital-filter-dialog.component';

describe('MasterSettingHospitalFilterDialogComponent', () => {
  let component: MasterSettingHospitalFilterDialogComponent;
  let fixture: ComponentFixture<MasterSettingHospitalFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterSettingHospitalFilterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterSettingHospitalFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
