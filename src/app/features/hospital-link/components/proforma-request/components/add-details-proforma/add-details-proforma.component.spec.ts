import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDetailsProformaComponent } from './add-details-proforma.component';

describe('AddDetailsProformaComponent', () => {
  let component: AddDetailsProformaComponent;
  let fixture: ComponentFixture<AddDetailsProformaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDetailsProformaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDetailsProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
