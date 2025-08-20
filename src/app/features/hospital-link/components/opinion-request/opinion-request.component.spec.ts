import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionRequestComponent } from './opinion-request.component';

describe('OpinionRequestComponent', () => {
  let component: OpinionRequestComponent;
  let fixture: ComponentFixture<OpinionRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpinionRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpinionRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
