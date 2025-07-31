import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimaryButtonComponent } from '../../../../shared/components/primary-button.component/primary-button.component';
import { TextInputComponent } from '../../../../shared/components/text-input.component/text-input.component';
import { InputLabelComponent } from '../../../../shared/components/input-label.component/input-label.component';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PrimaryButtonComponent, TextInputComponent, InputLabelComponent],
  templateUrl: './register.component.html',
})

export class RegisterComponent {
  formGroup: FormGroup
  errorMessage: string | null = null;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
      {
        validators: this.passwordsMatchValidator
      })

    this.formGroup.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = null;
      }
    });
  }

  private passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;

    // Mark all fields as touched to enable visual validation
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) return;
    const { name, email, password } = this.formGroup.value;

    this.authService.register(name, email, password).subscribe({

      next: () => {
          this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage = 'There is already a user with that email.';
        } else if (err.status === 400) {
          this.errorMessage = 'Validation error. Please check the fields.';
        } else {
          this.errorMessage = 'Unexpected error. Please try again later.';
        }
        this.changeDetectorRef.detectChanges();
        console.error(err);
      }
    });
  }
}
