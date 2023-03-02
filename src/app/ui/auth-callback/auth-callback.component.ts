import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {

  paramsJson: string = '';

  constructor(private route: ActivatedRoute) {
  }

  async ngOnInit(): Promise<void> {
    const code = this.route.snapshot.queryParamMap.get('code') ?? '';
    const accessTokenUrl = `http://localhost:9999/.netlify/functions/hello?code=${code}`
    const res = await fetch(accessTokenUrl);
    console.log(res);
    const json = await res.json();
    console.log(json);
    this.paramsJson = JSON.stringify(json);
  }
}
