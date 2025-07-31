import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputLabelComponent } from '../../../../shared/components/input-label.component/input-label.component';
import { PrimaryButtonComponent } from '../../../../shared/components/primary-button.component/primary-button.component';
import { TextInputComponent } from '../../../../shared/components/text-input.component/text-input.component';

@Component({
  selector: 'app-reset-password-page.component',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PrimaryButtonComponent, TextInputComponent, InputLabelComponent],
  templateUrl: './reset-password-page.component.html'
})
export class ResetPasswordPageComponent {
  formGroup: FormGroup;
  errorMessage: string | null = null;
  submitted: boolean = false;
  token: string = '';
  successMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.formGroup = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });

    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });

    this.formGroup.valueChanges.subscribe(() => {
      this.errorMessage = null;
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) return;

    const { password, confirmPassword } = this.formGroup.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.resetPassword(this.token, password).subscribe({
      next: () => {
        this.successMessage = 'Your password has been updated successfully.';
        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = 'Invalid or expired token';
        console.error(err);
        this.changeDetectorRef.detectChanges();
      }
    });
  }

}
