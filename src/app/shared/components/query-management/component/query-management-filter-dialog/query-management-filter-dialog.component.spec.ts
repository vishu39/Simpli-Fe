import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryManagementFilterDialogComponent } from './query-management-filter-dialog.component';

describe('QueryManagementFilterDialogComponent', () => {
  let component: QueryManagementFilterDialogComponent;
  let fixture: ComponentFixture<QueryManagementFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryManagementFilterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryManagementFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
