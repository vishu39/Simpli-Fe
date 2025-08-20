import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOpdEmailFetchComponent } from './add-opd-email-fetch.component';

describe('AddOpdEmailFetchComponent', () => {
  let component: AddOpdEmailFetchComponent;
  let fixture: ComponentFixture<AddOpdEmailFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOpdEmailFetchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOpdEmailFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
