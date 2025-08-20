import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdReceivedComponent } from './opd-received.component';

describe('OpdReceivedComponent', () => {
  let component: OpdReceivedComponent;
  let fixture: ComponentFixture<OpdReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpdReceivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpdReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
