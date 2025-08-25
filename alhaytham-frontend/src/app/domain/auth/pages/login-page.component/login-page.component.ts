import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginComponent } from '../../components/login.component/login.component';

@Component({
  selector: 'app-login-page.component',
  imports: [CommonModule, LoginComponent],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {

}
