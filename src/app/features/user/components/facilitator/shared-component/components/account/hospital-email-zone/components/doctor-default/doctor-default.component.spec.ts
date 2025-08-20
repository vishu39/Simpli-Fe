import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorDefaultComponent } from './doctor-default.component';

describe('DoctorDefaultComponent', () => {
  let component: DoctorDefaultComponent;
  let fixture: ComponentFixture<DoctorDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
