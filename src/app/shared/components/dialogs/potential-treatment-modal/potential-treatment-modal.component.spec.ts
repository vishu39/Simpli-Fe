import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotentialTreatmentModalComponent } from './potential-treatment-modal.component';

describe('PotentialTreatmentModalComponent', () => {
  let component: PotentialTreatmentModalComponent;
  let fixture: ComponentFixture<PotentialTreatmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PotentialTreatmentModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PotentialTreatmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
