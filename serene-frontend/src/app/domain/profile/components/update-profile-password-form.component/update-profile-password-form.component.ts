import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryButtonComponent } from '../../../../shared/components/primary-button.component/primary-button.component';
import { TextInputComponent } from '../../../../shared/components/text-input.component/text-input.component';
import { InputLabelComponent } from '../../../../shared/components/input-label.component/input-label.component';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-update-profile-password-form',
  imports: [CommonModule, ReactiveFormsModule, PrimaryButtonComponent, TextInputComponent, InputLabelComponent],
  standalone: true,
  templateUrl: './update-profile-password-form.component.html'
})

export class UpdateProfilePasswordFormComponent {
  formGroup: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  submitted: boolean = false;

  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.formGroup = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmNewPassword: ['', Validators.required]
    }, {
      validators: this.passwordsMatchValidator
    })

    this.formGroup.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = null;
      }
    });
  }

  private passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmNewPassword = group.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;

    // Mark all fields as touched to enable visual validation
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) return;
    const { currentPassword, newPassword } = this.formGroup.value;

    this.profileService.changePassword({ currentPassword, newPassword }).subscribe({

      next: () => {
        this.errorMessage = null;
        this.successMessage = 'Password updated successfully';

        // Clear the form
        this.formGroup.patchValue({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });

        this.submitted = false;

        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
         this.successMessage = null;
        if (err.status === 400) {
          this.errorMessage = 'Invalid current password';
        } else {
          this.errorMessage = 'Unexpected error. Please try again later.';
        }

        this.changeDetectorRef.detectChanges();
        console.error(err);
      }
    });
  }

}
