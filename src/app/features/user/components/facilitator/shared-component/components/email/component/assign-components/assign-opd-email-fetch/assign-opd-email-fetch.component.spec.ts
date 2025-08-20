import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignOpdEmailFetchComponent } from './assign-opd-email-fetch.component';

describe('AssignOpdEmailFetchComponent', () => {
  let component: AssignOpdEmailFetchComponent;
  let fixture: ComponentFixture<AssignOpdEmailFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignOpdEmailFetchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignOpdEmailFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
