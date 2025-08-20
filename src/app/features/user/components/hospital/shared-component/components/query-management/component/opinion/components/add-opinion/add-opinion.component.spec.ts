import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOpinionComponent } from './add-opinion.component';

describe('AddOpinionComponent', () => {
  let component: AddOpinionComponent;
  let fixture: ComponentFixture<AddOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOpinionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
