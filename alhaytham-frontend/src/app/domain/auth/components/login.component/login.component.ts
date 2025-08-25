import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PrimaryButtonComponent } from "../../../../shared/components/primary-button.component/primary-button.component";
import { TextInputComponent } from "../../../../shared/components/text-input.component/text-input.component";
import { InputLabelComponent } from '../../../../shared/components/input-label.component/input-label.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, PrimaryButtonComponent, TextInputComponent, InputLabelComponent],
    templateUrl: './login.component.html',
})

export class LoginComponent {
    formGroup: FormGroup;
    errorMessage: string | null = null;
    submitted: boolean = false;
    visiblityLoginPassword:string = "password";

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.formGroup = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });

        this.formGroup.valueChanges.subscribe(() => {
            if (this.errorMessage) {
                this.errorMessage = null;
            }
        });
    }

    onSubmit(): void {
        this.submitted = true;

        // Mark all fields as touched to enable visual validation
        this.formGroup.markAllAsTouched();

        if (this.formGroup.invalid) return;

        const { email, password } = this.formGroup.value;
        this.authService.login(email, password).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                if (err.status === 401) {
                    this.errorMessage = 'Incorrect email or password';
                } else {
                    this.errorMessage = 'Unexpected error. Please try again later';
                }
                this.changeDetectorRef.detectChanges();
                console.error(err);
            }
        });
    }

    visiblityPassword(){
        if(this.visiblityLoginPassword === 'password'){
        this.visiblityLoginPassword = 'text';
        }
        else if(this.visiblityLoginPassword === 'text') {
        this.visiblityLoginPassword = 'password';
        }
    }
}
