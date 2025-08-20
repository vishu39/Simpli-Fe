import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VilRequestDetailsComponent } from './vil-request-details.component';

describe('VilRequestDetailsComponent', () => {
  let component: VilRequestDetailsComponent;
  let fixture: ComponentFixture<VilRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VilRequestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VilRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
