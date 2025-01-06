import { Component } from '@angular/core';
import { LayoutService } from '../../../shared/service/app.layout.service';

@Component({
	selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent { 

    constructor(public layoutService: LayoutService) {}

	get dark(): boolean {
		return this.layoutService.config().colorScheme !== 'light';
	}

}
