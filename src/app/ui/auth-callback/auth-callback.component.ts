import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {

  readonly clientId = 'b8628367d18dae68d2d6';
  readonly clientSecret = '67e0e880e3d2524a13e6cc18988c05a7aef3fe60';
  readonly url = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&client_secret=${this.clientSecret}&redirect_uri=assets/authorized.html`;

  paramsJson: string = '';

  constructor(private route: ActivatedRoute) {
  }

  async ngOnInit(): Promise<void> {
    const code = this.route.snapshot.paramMap.get('code') ?? '';

    const url = `${this.url}&code=${code}`;

    const res = await fetch(url);
    console.log(res);
    const json = await res.json();
    console.log(json);
  }
}
