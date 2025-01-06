import { Component } from '@angular/core';
import { LayoutService } from '../shared/service/app.layout.service';

@Component({
	templateUrl: './auth.component.html'
})
export class AuthComponent {

	rememberMe: boolean = false;

	constructor(public layoutService: LayoutService) {}

	get dark(): boolean {
		return this.layoutService.config().colorScheme !== 'light';
	}

}
