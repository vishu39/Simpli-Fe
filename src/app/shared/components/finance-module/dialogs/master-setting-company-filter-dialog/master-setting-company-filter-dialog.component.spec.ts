import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSettingCompanyFilterDialogComponent } from './master-setting-company-filter-dialog.component';

describe('MasterSettingCompanyFilterDialogComponent', () => {
  let component: MasterSettingCompanyFilterDialogComponent;
  let fixture: ComponentFixture<MasterSettingCompanyFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterSettingCompanyFilterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterSettingCompanyFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
