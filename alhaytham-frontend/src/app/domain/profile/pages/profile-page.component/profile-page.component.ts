import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UpdateProfileFormComponent } from '../../components/update-profile-form.component/update-profile-form.component';
import { UpdateProfilePasswordFormComponent } from '../../components/update-profile-password-form.component/update-profile-password-form.component';
import { DeleteUserAccountFormComponent } from '../../components/delete-profile-user.component/delete-user-account-form.component';

@Component({
  selector: 'app-profile-page.component',
  imports: [CommonModule, UpdateProfileFormComponent, UpdateProfilePasswordFormComponent, DeleteUserAccountFormComponent],
  templateUrl: './profile-page.component.html'
})
export class ProfilePageComponent {

}
