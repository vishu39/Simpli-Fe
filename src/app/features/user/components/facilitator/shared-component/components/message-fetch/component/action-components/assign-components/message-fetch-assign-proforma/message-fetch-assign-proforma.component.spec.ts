import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFetchAssignProformaComponent } from './message-fetch-assign-proforma.component';

describe('MessageFetchAssignProformaComponent', () => {
  let component: MessageFetchAssignProformaComponent;
  let fixture: ComponentFixture<MessageFetchAssignProformaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFetchAssignProformaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFetchAssignProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
