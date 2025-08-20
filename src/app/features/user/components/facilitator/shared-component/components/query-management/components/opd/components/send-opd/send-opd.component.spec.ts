import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendOpdComponent } from './send-opd.component';

describe('SendOpdComponent', () => {
  let component: SendOpdComponent;
  let fixture: ComponentFixture<SendOpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendOpdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendOpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
