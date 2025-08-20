import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantDoctorComponent } from './assistant-doctor.component';

describe('AssistantDoctorComponent', () => {
  let component: AssistantDoctorComponent;
  let fixture: ComponentFixture<AssistantDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssistantDoctorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistantDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
