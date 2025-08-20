import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorOpinionAddedComponent } from './doctor-opinion-added.component';

describe('DoctorOpinionAddedComponent', () => {
  let component: DoctorOpinionAddedComponent;
  let fixture: ComponentFixture<DoctorOpinionAddedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorOpinionAddedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorOpinionAddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
