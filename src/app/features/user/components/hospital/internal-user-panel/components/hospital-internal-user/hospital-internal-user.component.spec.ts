import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalInternalUserComponent } from './hospital-internal-user.component';

describe('HospitalInternalUserComponent', () => {
  let component: HospitalInternalUserComponent;
  let fixture: ComponentFixture<HospitalInternalUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalInternalUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalInternalUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
