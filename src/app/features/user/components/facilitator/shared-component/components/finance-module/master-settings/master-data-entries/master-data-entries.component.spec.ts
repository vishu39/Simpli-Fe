import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataEntriesComponent } from './master-data-entries.component';

describe('MasterDataEntriesComponent', () => {
  let component: MasterDataEntriesComponent;
  let fixture: ComponentFixture<MasterDataEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDataEntriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterDataEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
