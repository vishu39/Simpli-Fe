import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryManagementToolbarComponent } from './query-management-toolbar.component';

describe('QueryManagementToolbarComponent', () => {
  let component: QueryManagementToolbarComponent;
  let fixture: ComponentFixture<QueryManagementToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryManagementToolbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryManagementToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
