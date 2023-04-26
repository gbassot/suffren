import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellDropdownComponent } from './cell-dropdown.component';

describe('CellDropdownComponent', () => {
  let component: CellDropdownComponent;
  let fixture: ComponentFixture<CellDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CellDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CellDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
