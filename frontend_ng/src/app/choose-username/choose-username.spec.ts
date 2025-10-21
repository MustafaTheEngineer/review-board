import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseUsername } from './choose-username';

describe('ChooseUsername', () => {
  let component: ChooseUsername;
  let fixture: ComponentFixture<ChooseUsername>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseUsername]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseUsername);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
