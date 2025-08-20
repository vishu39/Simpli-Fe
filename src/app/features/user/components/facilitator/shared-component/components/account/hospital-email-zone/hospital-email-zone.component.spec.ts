import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalEmailZoneComponent } from './hospital-email-zone.component';

describe('HospitalEmailZoneComponent', () => {
  let component: HospitalEmailZoneComponent;
  let fixture: ComponentFixture<HospitalEmailZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalEmailZoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalEmailZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
