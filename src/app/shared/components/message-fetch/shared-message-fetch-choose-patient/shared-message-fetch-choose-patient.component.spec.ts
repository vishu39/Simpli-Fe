import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedMessageFetchChoosePatientComponent } from './shared-message-fetch-choose-patient.component';

describe('SharedMessageFetchChoosePatientComponent', () => {
  let component: SharedMessageFetchChoosePatientComponent;
  let fixture: ComponentFixture<SharedMessageFetchChoosePatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedMessageFetchChoosePatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedMessageFetchChoosePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
