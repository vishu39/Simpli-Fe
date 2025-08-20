import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryViewSettingDialogComponent } from './query-view-setting-dialog.component';

describe('QueryViewSettingDialogComponent', () => {
  let component: QueryViewSettingDialogComponent;
  let fixture: ComponentFixture<QueryViewSettingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryViewSettingDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryViewSettingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
