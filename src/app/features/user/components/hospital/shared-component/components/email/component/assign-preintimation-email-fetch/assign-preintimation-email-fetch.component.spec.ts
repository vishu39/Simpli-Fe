import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPreintimationEmailFetchComponent } from './assign-preintimation-email-fetch.component';

describe('AssignPreintimationEmailFetchComponent', () => {
  let component: AssignPreintimationEmailFetchComponent;
  let fixture: ComponentFixture<AssignPreintimationEmailFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignPreintimationEmailFetchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignPreintimationEmailFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
