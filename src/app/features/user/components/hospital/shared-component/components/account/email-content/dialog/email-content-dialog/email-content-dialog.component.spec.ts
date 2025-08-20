import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailContentDialogComponent } from './email-content-dialog.component';

describe('EmailContentDialogComponent', () => {
  let component: EmailContentDialogComponent;
  let fixture: ComponentFixture<EmailContentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailContentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailContentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
