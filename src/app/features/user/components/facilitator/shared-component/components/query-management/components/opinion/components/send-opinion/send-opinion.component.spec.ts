import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendOpinionComponent } from './send-opinion.component';

describe('SendOpinionComponent', () => {
  let component: SendOpinionComponent;
  let fixture: ComponentFixture<SendOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendOpinionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
