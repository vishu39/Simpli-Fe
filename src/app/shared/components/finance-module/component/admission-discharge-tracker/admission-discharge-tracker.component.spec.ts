import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionDischargeTrackerComponent } from './admission-discharge-tracker.component';

describe('AdmissionDischargeTrackerComponent', () => {
  let component: AdmissionDischargeTrackerComponent;
  let fixture: ComponentFixture<AdmissionDischargeTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmissionDischargeTrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmissionDischargeTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
