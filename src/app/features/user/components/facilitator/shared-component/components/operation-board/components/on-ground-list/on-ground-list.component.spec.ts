import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnGroundListComponent } from './on-ground-list.component';

describe('OnGroundListComponent', () => {
  let component: OnGroundListComponent;
  let fixture: ComponentFixture<OnGroundListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnGroundListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnGroundListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
