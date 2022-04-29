import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedPointIterationComponent } from './fixed-point-iteration.component';

describe('FixedPointIterationComponent', () => {
  let component: FixedPointIterationComponent;
  let fixture: ComponentFixture<FixedPointIterationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedPointIterationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedPointIterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
