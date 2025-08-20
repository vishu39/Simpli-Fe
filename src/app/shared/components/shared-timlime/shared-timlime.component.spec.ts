import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTimlimeComponent } from './shared-timlime.component';

describe('SharedTimlimeComponent', () => {
  let component: SharedTimlimeComponent;
  let fixture: ComponentFixture<SharedTimlimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedTimlimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedTimlimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
