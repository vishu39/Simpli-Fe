import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDetailsOpinionComponent } from './add-details-opinion.component';

describe('AddDetailsOpinionComponent', () => {
  let component: AddDetailsOpinionComponent;
  let fixture: ComponentFixture<AddDetailsOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDetailsOpinionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDetailsOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
