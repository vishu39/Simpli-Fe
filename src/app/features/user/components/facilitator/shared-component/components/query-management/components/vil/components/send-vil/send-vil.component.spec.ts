import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendVilComponent } from './send-vil.component';

describe('SendVilComponent', () => {
  let component: SendVilComponent;
  let fixture: ComponentFixture<SendVilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendVilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendVilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
