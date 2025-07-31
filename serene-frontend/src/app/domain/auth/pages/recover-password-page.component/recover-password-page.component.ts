import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { InputLabelComponent } from '../../../../shared/components/input-label.component/input-label.component';
import { PrimaryButtonComponent } from '../../../../shared/components/primary-button.component/primary-button.component';
import { TextInputComponent } from '../../../../shared/components/text-input.component/text-input.component';

@Component({
  selector: 'app-recover-password-page.component',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PrimaryButtonComponent, TextInputComponent, InputLabelComponent],
  templateUrl: './recover-password-page.component.html',
})

export class RecoverPasswordPageComponent {
  formGroup: FormGroup;
  errorMessage: string | null = null;
  submitted: boolean = false;
  success: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.formGroup.valueChanges.subscribe(() => {
      this.errorMessage = null;
      this.success = false;
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) return;

    const { email } = this.formGroup.value;

    this.authService.recoverPassword(email).subscribe({
      next: () => {
        this.success = true;
        this.changeDetectorRef.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Unexpected error. Please try again later';
        console.error(err);
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}