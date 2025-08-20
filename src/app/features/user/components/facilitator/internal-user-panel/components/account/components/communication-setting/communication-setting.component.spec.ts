import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationSettingComponent } from './communication-setting.component';

describe('CommunicationSettingComponent', () => {
  let component: CommunicationSettingComponent;
  let fixture: ComponentFixture<CommunicationSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunicationSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunicationSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
