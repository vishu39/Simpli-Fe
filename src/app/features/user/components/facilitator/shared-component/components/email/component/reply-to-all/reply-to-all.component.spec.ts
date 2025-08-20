import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyToAllComponent } from './reply-to-all.component';

describe('ReplyToAllComponent', () => {
  let component: ReplyToAllComponent;
  let fixture: ComponentFixture<ReplyToAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplyToAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplyToAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
