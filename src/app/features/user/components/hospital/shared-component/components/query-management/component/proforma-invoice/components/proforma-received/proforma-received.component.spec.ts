import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaReceivedComponent } from './proforma-received.component';

describe('ProformaReceivedComponent', () => {
  let component: ProformaReceivedComponent;
  let fixture: ComponentFixture<ProformaReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformaReceivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformaReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
