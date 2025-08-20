import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVilComponent } from './edit-vil.component';

describe('EditVilComponent', () => {
  let component: EditVilComponent;
  let fixture: ComponentFixture<EditVilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditVilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditVilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
