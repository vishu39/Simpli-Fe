import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFilterModalComponent } from './patient-filter-modal.component';

describe('PatientFilterModalComponent', () => {
  let component: PatientFilterModalComponent;
  let fixture: ComponentFixture<PatientFilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientFilterModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
