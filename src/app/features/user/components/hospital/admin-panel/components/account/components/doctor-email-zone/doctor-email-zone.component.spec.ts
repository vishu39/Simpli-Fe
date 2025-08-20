import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorEmailZoneComponent } from './doctor-email-zone.component';

describe('DoctorEmailZoneComponent', () => {
  let component: DoctorEmailZoneComponent;
  let fixture: ComponentFixture<DoctorEmailZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorEmailZoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorEmailZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
