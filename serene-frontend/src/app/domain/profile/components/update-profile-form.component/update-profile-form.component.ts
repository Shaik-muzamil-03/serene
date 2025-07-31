import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimaryButtonComponent } from '../../../../shared/components/primary-button.component/primary-button.component';
import { TextInputComponent } from '../../../../shared/components/text-input.component/text-input.component';
import { InputLabelComponent } from '../../../../shared/components/input-label.component/input-label.component';
import { CommonModule } from '@angular/common';
import { UserInterface } from '../../../auth/interfaces/user.interface';

@Component({
  selector: 'app-update-profile-form',
  imports: [CommonModule, ReactiveFormsModule, PrimaryButtonComponent, TextInputComponent, InputLabelComponent],
  standalone: true,
  templateUrl: './update-profile-form.component.html'
})

export class UpdateProfileFormComponent implements OnInit {
  formGroup: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  submitted: boolean = false;
  user: UserInterface | null = null;

  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.formGroup = this.formBuilder.group({
      name: [''],
      email: ['', [Validators.email]]
    });
  }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (response) => {
        this.user = response;

        this.formGroup.patchValue({
          name: response.name,
          email: response.email
        });
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load profile: ', err);
        this.errorMessage = 'Failed to load profile information';
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    const { name, email } = this.formGroup.value;

    this.profileService.updateProfile({ name, email }).subscribe({
      next: (response) => {
        this.user = response;
        sessionStorage.removeItem('currentUser');
        sessionStorage.setItem('currentUser', JSON.stringify(response))
        this.errorMessage = null;
        this.successMessage = 'Profile updated successfully';
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.successMessage = null;

        if (err.status === 409) {
          this.errorMessage = "Email already exists"
        }

        if (err.status === 401) {
          this.errorMessage = 'Unexpected error. Please try again later'
        }
        this.changeDetectorRef.detectChanges();
        console.error(err);
      }
    })
  }
}
