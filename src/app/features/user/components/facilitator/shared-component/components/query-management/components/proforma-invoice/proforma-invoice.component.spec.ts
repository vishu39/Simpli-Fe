import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaInvoiceComponent } from './proforma-invoice.component';

describe('ProformaInvoiceComponent', () => {
  let component: ProformaInvoiceComponent;
  let fixture: ComponentFixture<ProformaInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformaInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformaInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
