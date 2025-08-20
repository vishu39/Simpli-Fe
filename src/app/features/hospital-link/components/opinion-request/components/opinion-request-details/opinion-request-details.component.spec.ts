import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionRequestDetailsComponent } from './opinion-request-details.component';

describe('OpinionRequestDetailsComponent', () => {
  let component: OpinionRequestDetailsComponent;
  let fixture: ComponentFixture<OpinionRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpinionRequestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpinionRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
