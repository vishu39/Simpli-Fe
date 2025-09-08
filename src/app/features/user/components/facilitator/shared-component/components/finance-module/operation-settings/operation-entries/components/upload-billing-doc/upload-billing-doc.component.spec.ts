import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBillingDocComponent } from './upload-billing-doc.component';

describe('UploadBillingDocComponent', () => {
  let component: UploadBillingDocComponent;
  let fixture: ComponentFixture<UploadBillingDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadBillingDocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadBillingDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
