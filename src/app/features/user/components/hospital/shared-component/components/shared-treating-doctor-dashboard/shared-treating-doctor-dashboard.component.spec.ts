import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTreatingDoctorDashboardComponent } from './shared-treating-doctor-dashboard.component';

describe('SharedTreatingDoctorDashboardComponent', () => {
  let component: SharedTreatingDoctorDashboardComponent;
  let fixture: ComponentFixture<SharedTreatingDoctorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedTreatingDoctorDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedTreatingDoctorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
