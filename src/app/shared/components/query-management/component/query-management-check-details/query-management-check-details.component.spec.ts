import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryManagementCheckDetailsComponent } from './query-management-check-details.component';

describe('QueryManagementCheckDetailsComponent', () => {
  let component: QueryManagementCheckDetailsComponent;
  let fixture: ComponentFixture<QueryManagementCheckDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryManagementCheckDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryManagementCheckDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
