import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageItem } from './manage-item';

describe('ManageItem', () => {
  let component: ManageItem;
  let fixture: ComponentFixture<ManageItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
