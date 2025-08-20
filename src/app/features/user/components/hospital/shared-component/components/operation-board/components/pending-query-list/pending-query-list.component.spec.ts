import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingQueryListComponent } from './pending-query-list.component';

describe('PendingQueryListComponent', () => {
  let component: PendingQueryListComponent;
  let fixture: ComponentFixture<PendingQueryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingQueryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingQueryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
