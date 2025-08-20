import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VilRequestComponent } from './vil-request.component';

describe('VilRequestComponent', () => {
  let component: VilRequestComponent;
  let fixture: ComponentFixture<VilRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VilRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VilRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
