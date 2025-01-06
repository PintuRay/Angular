import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../shared/service/app.layout.service';

@Component({
	templateUrl: './auth.component.html'
})
export class AuthComponent  implements OnInit{

	rememberMe: boolean = false;

	constructor(public layoutService: LayoutService) {}
	ngOnInit() {
		
	}
	get dark(): boolean {
		return this.layoutService.config().colorScheme !== 'light';
	}

}
