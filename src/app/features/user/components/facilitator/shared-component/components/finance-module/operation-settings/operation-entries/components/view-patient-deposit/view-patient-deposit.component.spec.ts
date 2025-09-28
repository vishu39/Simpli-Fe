import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPatientDepositComponent } from './view-patient-deposit.component';

describe('ViewPatientDepositComponent', () => {
  let component: ViewPatientDepositComponent;
  let fixture: ComponentFixture<ViewPatientDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPatientDepositComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPatientDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
