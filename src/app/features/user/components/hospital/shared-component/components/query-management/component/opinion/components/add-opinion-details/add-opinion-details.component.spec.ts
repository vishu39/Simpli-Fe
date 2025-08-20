import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOpinionDetailsComponent } from './add-opinion-details.component';

describe('AddOpinionDetailsComponent', () => {
  let component: AddOpinionDetailsComponent;
  let fixture: ComponentFixture<AddOpinionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOpinionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOpinionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
