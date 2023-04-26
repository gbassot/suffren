import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialFormComponent } from './commercial-form.component';

describe('PriceFormComponent', () => {
  let component: CommercialFormComponent;
  let fixture: ComponentFixture<CommercialFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommercialFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommercialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
