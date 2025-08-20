import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignConfirmationEmailFetchComponent } from './assign-confirmation-email-fetch.component';

describe('AssignConfirmationEmailFetchComponent', () => {
  let component: AssignConfirmationEmailFetchComponent;
  let fixture: ComponentFixture<AssignConfirmationEmailFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignConfirmationEmailFetchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignConfirmationEmailFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
