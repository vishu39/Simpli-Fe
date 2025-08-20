import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDetailsConfiramtionComponent } from './add-details-confiramtion.component';

describe('AddDetailsConfiramtionComponent', () => {
  let component: AddDetailsConfiramtionComponent;
  let fixture: ComponentFixture<AddDetailsConfiramtionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDetailsConfiramtionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDetailsConfiramtionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
