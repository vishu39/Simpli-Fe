import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFetchImageLightboxComponent } from './email-fetch-image-lightbox.component';

describe('EmailFetchImageLightboxComponent', () => {
  let component: EmailFetchImageLightboxComponent;
  let fixture: ComponentFixture<EmailFetchImageLightboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailFetchImageLightboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailFetchImageLightboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
