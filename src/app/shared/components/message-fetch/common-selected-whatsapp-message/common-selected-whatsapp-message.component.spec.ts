import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSelectedWhatsappMessageComponent } from './common-selected-whatsapp-message.component';

describe('CommonSelectedWhatsappMessageComponent', () => {
  let component: CommonSelectedWhatsappMessageComponent;
  let fixture: ComponentFixture<CommonSelectedWhatsappMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonSelectedWhatsappMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonSelectedWhatsappMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
