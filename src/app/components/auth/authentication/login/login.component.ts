import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { SignInModel } from 'src/app/api/model/account/authentication/signIn-model';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { LayoutService } from '../../../shared/service/app.layout.service';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    //#region Property Declaration
    private readonly destroy$ = new Subject<void>();
    msg: string = '';
    user: SignInModel = new SignInModel();
    loginForm!: FormGroup;
    isLoading = false;
    showPassword = false;
    get dark(): boolean {
        return this.layoutSvcs.config().colorScheme !== 'light';
    }
    //#endregion

    //#region Constructor
    constructor(
        private fb: FormBuilder,
        public route: ActivatedRoute,
        public layoutSvcs: LayoutService,
        private authSvcs: AuthenticationService,
        private messageService: MessageService
    ) { }
    //#endregion

    //#region Lifecycle Hooks
    ngOnInit(): void {
        this.msg = this.route.snapshot.paramMap.get('message') ?? '';
        if(this.msg!==''){
            this.messageService.add({ severity: 'success', summary: 'success', detail: this.msg, });
        }
        this.initializeLoginForm();
        this.loginForm.valueChanges.subscribe((values) => {
            this.user = { ...this.user, ...values };
        });
    }
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    //#endregion

    //#region Form Initialization
    private initializeLoginForm(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/
                    ),
                ],
            ],
            rememberMe: [false],
        });
    }
    //#endregion

    //#region Client side Vaildation
    get emailControl() {
        return this.loginForm.get('email');
    }
    getEmailErrorMessage() {
        if (this.emailControl?.hasError('required')) {
            return 'Email is required.';
        }
        else {
            return '';
        }
    }
    get passwordControl() {
        return this.loginForm.get('password');
    }
    getPasswordErrorMessage() {
        if (this.passwordControl?.hasError('required')) {
            return 'Password is required.';
        }
        else {
            return '';
        }
    }
    //#endregion

    //#region field Operation
    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
    //#endregion

    //#region Operations
    login(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        } else {
            this.isLoading = true;
            this.authSvcs
                .login(this.user)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (response) => {
                        this.isLoading = false;
                        this.msg = this.authSvcs.handleLoginResponse(response, this.user.email);
                        if (this.msg !== '') {
                            this.messageService.add({ severity: 'warn', summary: 'warn', detail: this.msg });
                        }
                    },
                    error: (response) => {
                        this.isLoading = false;
                        this.msg = this.authSvcs.handleLoginError(response);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.msg });
                    },
                    complete: () => {
                        this.resetForm();
                        this.isLoading = false;
                    },
                });
        }
    }
    private resetForm(): void {
        this.loginForm.reset({
            email: '',
            password: '',
            rememberMe: false,
        });
    }
    //#endregion
}
