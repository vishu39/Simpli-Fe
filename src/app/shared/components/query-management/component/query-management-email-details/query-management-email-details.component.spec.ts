import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryManagementEmailDetailsComponent } from './query-management-email-details.component';

describe('QueryManagementEmailDetailsComponent', () => {
  let component: QueryManagementEmailDetailsComponent;
  let fixture: ComponentFixture<QueryManagementEmailDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryManagementEmailDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryManagementEmailDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
