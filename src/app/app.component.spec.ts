import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HeaderComponent } from './components/header/header.component';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { FooterComponent } from './components/footer/footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations:
    [
      AppComponent, 
      HeaderComponent, 
      FooterComponent
    ],
    imports:[
      MatBadgeModule,
      MatIconModule,
      MatMenuModule,
      MatSnackBarModule, 
      MatToolbarModule, 
      NgxPermissionsModule.forRoot(), 
      RouterTestingModule],
    providers:[NgxPermissionsService]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'onlinestoreapp'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Online Bookstore');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('onlinestoreapp app is running!');
  });
});
