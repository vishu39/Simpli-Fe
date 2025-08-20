import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalPasswordComponent } from './hospital-password.component';

describe('HospitalPasswordComponent', () => {
  let component: HospitalPasswordComponent;
  let fixture: ComponentFixture<HospitalPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
