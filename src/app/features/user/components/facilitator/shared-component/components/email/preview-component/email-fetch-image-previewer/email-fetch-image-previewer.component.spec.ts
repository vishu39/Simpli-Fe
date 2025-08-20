import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFetchImagePreviewerComponent } from './email-fetch-image-previewer.component';

describe('EmailFetchImagePreviewerComponent', () => {
  let component: EmailFetchImagePreviewerComponent;
  let fixture: ComponentFixture<EmailFetchImagePreviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailFetchImagePreviewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailFetchImagePreviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
