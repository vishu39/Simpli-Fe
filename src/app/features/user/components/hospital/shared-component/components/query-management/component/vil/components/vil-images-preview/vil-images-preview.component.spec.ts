import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VilImagesPreviewComponent } from './vil-images-preview.component';

describe('VilImagesPreviewComponent', () => {
  let component: VilImagesPreviewComponent;
  let fixture: ComponentFixture<VilImagesPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VilImagesPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VilImagesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
