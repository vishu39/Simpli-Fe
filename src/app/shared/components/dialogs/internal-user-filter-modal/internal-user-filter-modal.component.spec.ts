import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalUserFilterModalComponent } from './internal-user-filter-modal.component';

describe('InternalUserFilterModalComponent', () => {
  let component: InternalUserFilterModalComponent;
  let fixture: ComponentFixture<InternalUserFilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalUserFilterModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalUserFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
