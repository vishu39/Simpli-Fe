import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVilDetailsComponent } from './add-vil-details.component';

describe('AddVilDetailsComponent', () => {
  let component: AddVilDetailsComponent;
  let fixture: ComponentFixture<AddVilDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVilDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVilDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
