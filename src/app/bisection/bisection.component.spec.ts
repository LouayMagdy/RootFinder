import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BisectionComponent } from './bisection.component';

describe('BisectionComponent', () => {
  let component: BisectionComponent;
  let fixture: ComponentFixture<BisectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BisectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BisectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
