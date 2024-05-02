import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewBookComponent } from './view-book.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

describe('ViewBookComponent', () => {
  let component: ViewBookComponent;
  let fixture: ComponentFixture<ViewBookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewBookComponent],
      imports:[
        HttpClientTestingModule, 
        MatSlideToggleModule,
        MatProgressSpinnerModule,
        NgxPermissionsModule.forRoot(),
        FormsModule,
        RouterTestingModule,
      ],
      providers:[NgxPermissionsService]
    });
    fixture = TestBed.createComponent(ViewBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
