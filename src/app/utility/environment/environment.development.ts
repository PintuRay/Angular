export const environment = {
    production: false,
    apiUrl: 'https://localhost:7118/',
    EmailConfirmation: 'http://localhost:4200/auth/verify-confirmation-mail/{uid}/{token}',
    ResetPassword: 'http://localhost:4200/auth/reset-password/{uid}/{token}',
};