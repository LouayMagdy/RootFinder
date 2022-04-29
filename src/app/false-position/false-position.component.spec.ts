import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FalsePositionComponent } from './false-position.component';

describe('FalsePositionComponent', () => {
  let component: FalsePositionComponent;
  let fixture: ComponentFixture<FalsePositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FalsePositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FalsePositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
