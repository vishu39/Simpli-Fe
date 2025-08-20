import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatingDocPendingOpinionComponent } from './treating-doc-pending-opinion.component';

describe('TreatingDocPendingOpinionComponent', () => {
  let component: TreatingDocPendingOpinionComponent;
  let fixture: ComponentFixture<TreatingDocPendingOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatingDocPendingOpinionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatingDocPendingOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
