import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProformaInvoiceDetailsComponent } from './add-proforma-invoice-details.component';

describe('AddProformaInvoiceDetailsComponent', () => {
  let component: AddProformaInvoiceDetailsComponent;
  let fixture: ComponentFixture<AddProformaInvoiceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProformaInvoiceDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProformaInvoiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
