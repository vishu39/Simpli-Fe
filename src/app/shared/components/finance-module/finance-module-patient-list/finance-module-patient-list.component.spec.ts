import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceModulePatientListComponent } from './finance-module-patient-list.component';

describe('FinanceModulePatientListComponent', () => {
  let component: FinanceModulePatientListComponent;
  let fixture: ComponentFixture<FinanceModulePatientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceModulePatientListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceModulePatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
