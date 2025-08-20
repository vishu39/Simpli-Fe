import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappFetchImageLightboxComponent } from './whatsapp-fetch-image-lightbox.component';

describe('WhatsappFetchImageLightboxComponent', () => {
  let component: WhatsappFetchImageLightboxComponent;
  let fixture: ComponentFixture<WhatsappFetchImageLightboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappFetchImageLightboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappFetchImageLightboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
