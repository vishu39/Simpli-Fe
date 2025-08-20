import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosePatientDialogComponent } from './close-patient-dialog.component';

describe('ClosePatientDialogComponent', () => {
  let component: ClosePatientDialogComponent;
  let fixture: ComponentFixture<ClosePatientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosePatientDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosePatientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
