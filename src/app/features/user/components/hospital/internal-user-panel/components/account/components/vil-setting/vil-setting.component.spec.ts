import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VilSettingComponent } from './vil-setting.component';

describe('VilSettingComponent', () => {
  let component: VilSettingComponent;
  let fixture: ComponentFixture<VilSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VilSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VilSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
