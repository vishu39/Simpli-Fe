import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionReceivedComponent } from './opinion-received.component';

describe('OpinionReceivedComponent', () => {
  let component: OpinionReceivedComponent;
  let fixture: ComponentFixture<OpinionReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpinionReceivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpinionReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
