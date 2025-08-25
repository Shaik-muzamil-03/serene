import { Component } from '@angular/core';
import { RegisterComponent } from '../../components/register.component/register.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-page.component',
  imports: [CommonModule, RegisterComponent],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {

}
