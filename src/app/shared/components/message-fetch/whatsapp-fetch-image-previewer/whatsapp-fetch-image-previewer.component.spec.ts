import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappFetchImagePreviewerComponent } from './whatsapp-fetch-image-previewer.component';

describe('WhatsappFetchImagePreviewerComponent', () => {
  let component: WhatsappFetchImagePreviewerComponent;
  let fixture: ComponentFixture<WhatsappFetchImagePreviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsappFetchImagePreviewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappFetchImagePreviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
