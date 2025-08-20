import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatingDocAddedOpinionComponent } from './treating-doc-added-opinion.component';

describe('TreatingDocAddedOpinionComponent', () => {
  let component: TreatingDocAddedOpinionComponent;
  let fixture: ComponentFixture<TreatingDocAddedOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatingDocAddedOpinionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatingDocAddedOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
