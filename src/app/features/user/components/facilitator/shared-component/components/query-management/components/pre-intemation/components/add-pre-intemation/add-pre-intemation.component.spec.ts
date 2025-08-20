import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPreIntemationComponent } from './add-pre-intemation.component';

describe('AddPreIntemationComponent', () => {
  let component: AddPreIntemationComponent;
  let fixture: ComponentFixture<AddPreIntemationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPreIntemationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPreIntemationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
