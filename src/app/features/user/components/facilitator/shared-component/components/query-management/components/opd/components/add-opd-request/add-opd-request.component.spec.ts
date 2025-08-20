import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOpdRequestComponent } from './add-opd-request.component';

describe('AddOpdRequestComponent', () => {
  let component: AddOpdRequestComponent;
  let fixture: ComponentFixture<AddOpdRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOpdRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOpdRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
