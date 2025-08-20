import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVilRequestComponent } from './add-vil-request.component';

describe('AddVilRequestComponent', () => {
  let component: AddVilRequestComponent;
  let fixture: ComponentFixture<AddVilRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVilRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVilRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
