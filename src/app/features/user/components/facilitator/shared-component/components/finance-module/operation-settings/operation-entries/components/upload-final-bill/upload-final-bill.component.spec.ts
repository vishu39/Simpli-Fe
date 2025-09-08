import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFinalBillComponent } from './upload-final-bill.component';

describe('UploadFinalBillComponent', () => {
  let component: UploadFinalBillComponent;
  let fixture: ComponentFixture<UploadFinalBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFinalBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadFinalBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
