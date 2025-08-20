import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDetailsOpdComponent } from './add-details-opd.component';

describe('AddDetailsOpdComponent', () => {
  let component: AddDetailsOpdComponent;
  let fixture: ComponentFixture<AddDetailsOpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDetailsOpdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDetailsOpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
