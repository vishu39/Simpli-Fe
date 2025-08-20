import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowloadProformaComponent } from './dowload-proforma.component';

describe('DowloadProformaComponent', () => {
  let component: DowloadProformaComponent;
  let fixture: ComponentFixture<DowloadProformaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DowloadProformaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DowloadProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
