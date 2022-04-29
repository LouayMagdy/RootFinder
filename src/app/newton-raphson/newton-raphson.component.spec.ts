import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewtonRaphsonComponent } from './newton-raphson.component';

describe('NewtonRaphsonComponent', () => {
  let component: NewtonRaphsonComponent;
  let fixture: ComponentFixture<NewtonRaphsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewtonRaphsonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewtonRaphsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
