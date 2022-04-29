import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecantComponent } from './secant.component';

describe('SecantComponent', () => {
  let component: SecantComponent;
  let fixture: ComponentFixture<SecantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
