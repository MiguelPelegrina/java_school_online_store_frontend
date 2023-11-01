import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressSelectorComponent } from './address-selector.component';

describe('AddressSelectorComponent', () => {
  let component: AddressSelectorComponent;
  let fixture: ComponentFixture<AddressSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressSelectorComponent]
    });
    fixture = TestBed.createComponent(AddressSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
