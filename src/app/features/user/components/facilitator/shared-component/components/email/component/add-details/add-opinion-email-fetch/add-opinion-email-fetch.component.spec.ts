import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOpinionEmailFetchComponent } from './add-opinion-email-fetch.component';

describe('AddOpinionEmailFetchComponent', () => {
  let component: AddOpinionEmailFetchComponent;
  let fixture: ComponentFixture<AddOpinionEmailFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOpinionEmailFetchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOpinionEmailFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
