import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgementSettingComponent } from './acknowledgement-setting.component';

describe('AcknowledgementSettingComponent', () => {
  let component: AcknowledgementSettingComponent;
  let fixture: ComponentFixture<AcknowledgementSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcknowledgementSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcknowledgementSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
