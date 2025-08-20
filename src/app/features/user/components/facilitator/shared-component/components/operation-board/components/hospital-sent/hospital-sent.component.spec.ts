import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalSentComponent } from './hospital-sent.component';

describe('HospitalSentComponent', () => {
  let component: HospitalSentComponent;
  let fixture: ComponentFixture<HospitalSentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalSentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
