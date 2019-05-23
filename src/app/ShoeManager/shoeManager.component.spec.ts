import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoeManagerComponent } from './shoeManager.component';

describe('ShoeManagerComponent', () => {
  let component: ShoeManagerComponent;
  let fixture: ComponentFixture<ShoeManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoeManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoeManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
