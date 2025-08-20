import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VilReceivedComponent } from './vil-received.component';

describe('VilReceivedComponent', () => {
  let component: VilReceivedComponent;
  let fixture: ComponentFixture<VilReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VilReceivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VilReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
