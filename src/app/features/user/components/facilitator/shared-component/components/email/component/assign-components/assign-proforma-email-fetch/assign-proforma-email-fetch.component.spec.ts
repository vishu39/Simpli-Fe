import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignProformaEmailFetchComponent } from './assign-proforma-email-fetch.component';

describe('AssignProformaEmailFetchComponent', () => {
  let component: AssignProformaEmailFetchComponent;
  let fixture: ComponentFixture<AssignProformaEmailFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignProformaEmailFetchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignProformaEmailFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
