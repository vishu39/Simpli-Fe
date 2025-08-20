import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTreatmentPackageDialogComponent } from './add-treatment-package-dialog.component';

describe('AddTreatmentPackageDialogComponent', () => {
  let component: AddTreatmentPackageDialogComponent;
  let fixture: ComponentFixture<AddTreatmentPackageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTreatmentPackageDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTreatmentPackageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
