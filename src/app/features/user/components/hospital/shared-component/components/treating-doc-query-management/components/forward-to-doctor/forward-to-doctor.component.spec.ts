import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardToDoctorComponent } from './forward-to-doctor.component';

describe('ForwardToDoctorComponent', () => {
  let component: ForwardToDoctorComponent;
  let fixture: ComponentFixture<ForwardToDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwardToDoctorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForwardToDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
