import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVilEmailFetchComponent } from './add-vil-email-fetch.component';

describe('AddVilEmailFetchComponent', () => {
  let component: AddVilEmailFetchComponent;
  let fixture: ComponentFixture<AddVilEmailFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVilEmailFetchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVilEmailFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
