import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendProformaInvoiceComponent } from './send-proforma-invoice.component';

describe('SendProformaInvoiceComponent', () => {
  let component: SendProformaInvoiceComponent;
  let fixture: ComponentFixture<SendProformaInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendProformaInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendProformaInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
