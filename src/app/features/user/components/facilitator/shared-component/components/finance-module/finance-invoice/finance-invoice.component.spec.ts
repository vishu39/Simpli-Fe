import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceInvoiceComponent } from './finance-invoice.component';

describe('FinanceInvoiceComponent', () => {
  let component: FinanceInvoiceComponent;
  let fixture: ComponentFixture<FinanceInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
