import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { SignInModel } from 'src/app/api/model/account/authentication/signIn-model';
import { AuthenticationService } from 'src/app/api/service/account/authentication/authentication.service';
import { LayoutService } from '../../../shared/service/app.layout.service';
import { ActivatedRoute } from '@angular/router';
import { GenericMessageService } from 'src/app/api/service/generic-message.Service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

    //#region Property Declaration
    private readonly destroy$ = new Subject<void>();
    msg: string = '';
    user: SignInModel = new SignInModel();
    loginForm: FormGroup = this.initializeLoginForm();
    isLoading = false;
    showPassword = false;
    display: boolean = false;
    //#endregion

    //#region Constructor
    constructor(
        private fb: FormBuilder,
        public route: ActivatedRoute,
        public layoutSvcs: LayoutService,
        private authSvcs: AuthenticationService,
        private messageService: GenericMessageService
    ) { }
    //#endregion

    //#region Lifecycle Hooks
    ngOnInit(): void {
        this.msg = this.route.snapshot.paramMap.get('message') ?? '';
        if (this.msg !== '') {
            this.messageService.success(this.msg);
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
    private initializeLoginForm() {
        return this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/)]],
            rememberMe: [false],
        });
    }
    //#endregion

    //#region Client side Vaildation
    private getFieldLabel(controlName: string): string {
        const labels: { [key: string]: string } = {
            email: 'Email',
            password: 'Password',
        };
        return labels[controlName] || controlName;
    }
    private getFormControl(controlName: string) {
        return this.loginForm.get(controlName);
    }
    public isFieldInvalid(controlName: string): boolean {
        const control = this.getFormControl(controlName);
        return !!control && control.invalid && (control.dirty || control.touched);
    }
    public getErrorMessage(controlName: string): string {
        const control = this.getFormControl(controlName);
        if (!control) return '';
        if (control.hasError('required')) {
            return `${this.getFieldLabel(controlName)} is required.`;
        }
        return '';
    }
    //#endregion

    //#region Client Side Operations
    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }
    private resetForm(): void {
        this.loginForm.reset({
            email: '',
            password: '',
            rememberMe: false,
        });
    }
    //#endregion

    //#region Server Side Operations
    login(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        } else {
            this.isLoading = true;
            this.authSvcs.login(this.user).pipe(takeUntil(this.destroy$)).subscribe({
                next: (response) => {
                    this.isLoading = false;
                    this.msg = this.authSvcs.handleLoginResponse(response, this.user.email);
                    if (this.msg !== '') {
                        this.messageService.warning(this.msg);
                    }
                    this.resetForm();
                },
                error: (response) => {
                    this.isLoading = false;
                    this.msg = this.authSvcs.handleLoginError(response);
                    this.messageService.error(this.msg);
                },
            });
        }
    }
    //#endregion

    //#region Test form
    get formJson(): string {
        return JSON.stringify(this.loginForm.value, null, 2);
    }
    get modelJson(): string {
        return JSON.stringify(this.user, null, 2);
    }
    get formErrors(): string {
        return JSON.stringify(this.loginForm.errors, null, 2);
    }
    //#endregion
}
