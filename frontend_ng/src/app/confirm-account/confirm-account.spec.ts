import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAccount } from './confirm-account';

describe('ConfirmAccount', () => {
  let component: ConfirmAccount;
  let fixture: ComponentFixture<ConfirmAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
