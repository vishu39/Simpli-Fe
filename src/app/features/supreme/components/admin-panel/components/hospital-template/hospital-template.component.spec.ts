import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalTemplateComponent } from './hospital-template.component';

describe('HospitalTemplateComponent', () => {
  let component: HospitalTemplateComponent;
  let fixture: ComponentFixture<HospitalTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
