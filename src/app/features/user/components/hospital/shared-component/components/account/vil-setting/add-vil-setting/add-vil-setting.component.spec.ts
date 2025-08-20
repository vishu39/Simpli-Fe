import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVilSettingComponent } from './add-vil-setting.component';

describe('AddVilSettingComponent', () => {
  let component: AddVilSettingComponent;
  let fixture: ComponentFixture<AddVilSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVilSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVilSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
