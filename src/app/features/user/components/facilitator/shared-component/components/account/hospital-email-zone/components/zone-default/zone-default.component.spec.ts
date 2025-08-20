import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneDefaultComponent } from './zone-default.component';

describe('ZoneDefaultComponent', () => {
  let component: ZoneDefaultComponent;
  let fixture: ComponentFixture<ZoneDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
