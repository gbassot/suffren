import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuffrenComponent } from './suffren.component';

describe('SuffrenComponent', () => {
  let component: SuffrenComponent;
  let fixture: ComponentFixture<SuffrenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuffrenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuffrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
