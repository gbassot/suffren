import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellSwitchComponent } from './cell-switch.component';

describe('CellSwitchComponent', () => {
  let component: CellSwitchComponent;
  let fixture: ComponentFixture<CellSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CellSwitchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CellSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
