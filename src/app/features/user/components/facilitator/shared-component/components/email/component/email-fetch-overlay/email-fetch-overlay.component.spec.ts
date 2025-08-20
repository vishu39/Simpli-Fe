import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFetchOverlayComponent } from './email-fetch-overlay.component';

describe('EmailFetchOverlayComponent', () => {
  let component: EmailFetchOverlayComponent;
  let fixture: ComponentFixture<EmailFetchOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailFetchOverlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailFetchOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
