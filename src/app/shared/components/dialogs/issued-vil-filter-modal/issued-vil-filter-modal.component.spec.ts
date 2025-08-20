import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedVilFilterModalComponent } from './issued-vil-filter-modal.component';

describe('IssuedVilFilterModalComponent', () => {
  let component: IssuedVilFilterModalComponent;
  let fixture: ComponentFixture<IssuedVilFilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssuedVilFilterModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssuedVilFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
