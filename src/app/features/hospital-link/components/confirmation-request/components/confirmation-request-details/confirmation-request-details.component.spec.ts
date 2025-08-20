import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationRequestDetailsComponent } from './confirmation-request-details.component';

describe('ConfirmationRequestDetailsComponent', () => {
  let component: ConfirmationRequestDetailsComponent;
  let fixture: ComponentFixture<ConfirmationRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationRequestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmationRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
