import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProformaInvoiceComponent } from './add-proforma-invoice.component';

describe('AddProformaInvoiceComponent', () => {
  let component: AddProformaInvoiceComponent;
  let fixture: ComponentFixture<AddProformaInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProformaInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProformaInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
