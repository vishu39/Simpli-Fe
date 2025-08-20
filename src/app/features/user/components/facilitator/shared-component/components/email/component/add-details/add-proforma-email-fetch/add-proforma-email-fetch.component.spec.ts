import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProformaEmailFetchComponent } from './add-proforma-email-fetch.component';

describe('AddProformaEmailFetchComponent', () => {
  let component: AddProformaEmailFetchComponent;
  let fixture: ComponentFixture<AddProformaEmailFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProformaEmailFetchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProformaEmailFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
