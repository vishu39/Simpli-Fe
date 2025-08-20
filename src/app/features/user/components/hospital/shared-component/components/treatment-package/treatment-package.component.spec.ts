import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentPackageComponent } from './treatment-package.component';

describe('TreatmentPackageComponent', () => {
  let component: TreatmentPackageComponent;
  let fixture: ComponentFixture<TreatmentPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmentPackageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatmentPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
