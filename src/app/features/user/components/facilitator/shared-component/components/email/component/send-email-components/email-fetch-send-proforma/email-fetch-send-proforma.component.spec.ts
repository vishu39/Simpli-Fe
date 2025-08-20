import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFetchSendProformaComponent } from './email-fetch-send-proforma.component';

describe('EmailFetchSendProformaComponent', () => {
  let component: EmailFetchSendProformaComponent;
  let fixture: ComponentFixture<EmailFetchSendProformaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailFetchSendProformaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailFetchSendProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
