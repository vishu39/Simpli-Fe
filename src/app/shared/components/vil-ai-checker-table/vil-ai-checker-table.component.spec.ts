import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VilAiCheckerTableComponent } from './vil-ai-checker-table.component';

describe('VilAiCheckerTableComponent', () => {
  let component: VilAiCheckerTableComponent;
  let fixture: ComponentFixture<VilAiCheckerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VilAiCheckerTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VilAiCheckerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
