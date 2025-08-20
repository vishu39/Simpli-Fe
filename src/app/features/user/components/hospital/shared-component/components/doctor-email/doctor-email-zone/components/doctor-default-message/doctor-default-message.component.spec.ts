import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorDefaultMessageComponent } from './doctor-default-message.component';

describe('DoctorDefaultMessageComponent', () => {
  let component: DoctorDefaultMessageComponent;
  let fixture: ComponentFixture<DoctorDefaultMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorDefaultMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorDefaultMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
