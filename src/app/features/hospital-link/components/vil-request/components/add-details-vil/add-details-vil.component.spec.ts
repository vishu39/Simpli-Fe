import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDetailsVilComponent } from './add-details-vil.component';

describe('AddDetailsVilComponent', () => {
  let component: AddDetailsVilComponent;
  let fixture: ComponentFixture<AddDetailsVilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDetailsVilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDetailsVilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
