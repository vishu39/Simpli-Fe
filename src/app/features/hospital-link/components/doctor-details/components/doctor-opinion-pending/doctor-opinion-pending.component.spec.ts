import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorOpinionPendingComponent } from './doctor-opinion-pending.component';

describe('DoctorOpinionPendingComponent', () => {
  let component: DoctorOpinionPendingComponent;
  let fixture: ComponentFixture<DoctorOpinionPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorOpinionPendingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorOpinionPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
