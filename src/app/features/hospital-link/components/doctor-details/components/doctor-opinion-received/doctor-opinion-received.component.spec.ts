import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorOpinionReceivedComponent } from './doctor-opinion-received.component';

describe('DoctorOpinionReceivedComponent', () => {
  let component: DoctorOpinionReceivedComponent;
  let fixture: ComponentFixture<DoctorOpinionReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorOpinionReceivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorOpinionReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
