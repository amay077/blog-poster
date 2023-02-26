import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  readonly clientId = 'b8628367d18dae68d2d6';
  readonly url = `https://github.com/login/oauth/authorize?client_id=${this.clientId}`;

  constructor() {
  }
}
