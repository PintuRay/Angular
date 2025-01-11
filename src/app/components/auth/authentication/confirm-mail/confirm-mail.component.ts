import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-confirm-mail',
  templateUrl: './confirm-mail.component.html',
})
export class ConfirmMailComponent implements OnInit{
  message: any;
  constructor(
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.message = this.route.snapshot.paramMap.get('message');
  }
}
