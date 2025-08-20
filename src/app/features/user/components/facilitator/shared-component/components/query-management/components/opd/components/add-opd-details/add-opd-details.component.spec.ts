import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOpdDetailsComponent } from './add-opd-details.component';

describe('AddOpdDetailsComponent', () => {
  let component: AddOpdDetailsComponent;
  let fixture: ComponentFixture<AddOpdDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOpdDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOpdDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
