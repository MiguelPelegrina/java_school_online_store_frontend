import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGroupComponent } from './button-group.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

describe('ButtonGroupComponent', () => {
  let component: ButtonGroupComponent;
  let fixture: ComponentFixture<ButtonGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonGroupComponent],
      imports:[MatSnackBarModule, MatIconModule],
    });
    fixture = TestBed.createComponent(ButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
