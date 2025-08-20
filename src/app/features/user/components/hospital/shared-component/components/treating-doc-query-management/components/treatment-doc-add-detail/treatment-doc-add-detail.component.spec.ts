import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentDocAddDetailComponent } from './treatment-doc-add-detail.component';

describe('TreatmentDocAddDetailComponent', () => {
  let component: TreatmentDocAddDetailComponent;
  let fixture: ComponentFixture<TreatmentDocAddDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatmentDocAddDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatmentDocAddDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
