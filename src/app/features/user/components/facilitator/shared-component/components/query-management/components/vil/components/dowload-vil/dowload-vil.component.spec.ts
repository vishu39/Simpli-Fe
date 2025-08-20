import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowloadVilComponent } from './dowload-vil.component';

describe('DowloadVilComponent', () => {
  let component: DowloadVilComponent;
  let fixture: ComponentFixture<DowloadVilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DowloadVilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DowloadVilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
