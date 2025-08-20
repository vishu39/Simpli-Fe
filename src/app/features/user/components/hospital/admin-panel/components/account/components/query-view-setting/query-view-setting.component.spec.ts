import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryViewSettingComponent } from './query-view-setting.component';

describe('QueryViewSettingComponent', () => {
  let component: QueryViewSettingComponent;
  let fixture: ComponentFixture<QueryViewSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryViewSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryViewSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
