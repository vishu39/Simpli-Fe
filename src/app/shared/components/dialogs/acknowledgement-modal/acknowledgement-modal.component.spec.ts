import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgementModalComponent } from './acknowledgement-modal.component';

describe('AcknowledgementModalComponent', () => {
  let component: AcknowledgementModalComponent;
  let fixture: ComponentFixture<AcknowledgementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcknowledgementModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcknowledgementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
