import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from '../../../../shared/components/primary-button.component/primary-button.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../../../shared/components/text-input.component/text-input.component';
import { InputLabelComponent } from '../../../../shared/components/input-label.component/input-label.component';
import { ModalComponent } from "../../../../shared/components/modal.component/modal.component";

@Component({
  selector: 'app-delete-user-account-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrimaryButtonComponent,
    TextInputComponent,
    InputLabelComponent,
    ModalComponent
  ],
  templateUrl: './delete-user-account-form.component.html',
})
export class DeleteUserAccountFormComponent {
  formGroup: FormGroup;
  isDeleting: boolean = false;
  submitted: boolean = false;
  errorMessage: string | null = null;
  showDeleteModal: boolean = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.formGroup = this.formBuilder.group({
      currentPassword: ['', [Validators.required]]
    });

    this.formGroup.get('currentPassword')?.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = null;
      }
    });
  }

  openDeleteAccountModal() {
    this.showDeleteModal = true;
  }

  closeDeleteAccountModal() {
    this.showDeleteModal = false;
  }

  onSubmit(): void {
    if (this.formGroup.invalid) return;

    const { currentPassword } = this.formGroup.value;

    this.submitted = true;

    this.profileService.confirmPassword(currentPassword).subscribe({
      next: (response) => {
        if (!response.validPassword) {
          this.errorMessage = 'The password you entered is incorrect';
          this.changeDetectorRef.detectChanges();
          return;
        }

        this.errorMessage = null;
        this.closeDeleteAccountModal();
        this.deleteAccount();
      },
      error: (err) => {
        this.errorMessage = 'Failed to validate password. Please try again later';
        this.changeDetectorRef.detectChanges();
        console.error(err);
      }
    });
  }

  private deleteAccount(): void {
    this.isDeleting = true;

    this.profileService.deleteProfile().subscribe({
      next: () => {
        this.errorMessage = null;
        this.authService.removeUserItemFromSession();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete account. Please try again later';
        this.isDeleting = false;
        this.changeDetectorRef.detectChanges();
        console.error(err);
      }
    });
  }
}
