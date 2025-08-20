import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignOpinionEmailFetchComponent } from './assign-opinion-email-fetch.component';

describe('AssignOpinionEmailFetchComponent', () => {
  let component: AssignOpinionEmailFetchComponent;
  let fixture: ComponentFixture<AssignOpinionEmailFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignOpinionEmailFetchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignOpinionEmailFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
