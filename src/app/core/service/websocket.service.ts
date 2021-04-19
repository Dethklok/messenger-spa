import { Injectable, OnDestroy } from '@angular/core';

import * as SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { Client, StompHeaders } from '@stomp/stompjs';
import { KeycloakService } from 'keycloak-angular';
import { CsrfProvider } from '../provider/csrf/csrf.provider';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {

  private readonly stompClient: Client;
  private readonly token: string;
  private readonly headers: StompHeaders;

  constructor(
    private readonly keycloakService: KeycloakService,
    private readonly csrfProvider: CsrfProvider
  ) {
    const { token } = this.keycloakService.getKeycloakInstance();

    if (!token) {
      throw new Error('Error while creating WebsocketService: auth token not found!');
    }

    this.token = token;
    this.headers = this.getHeaders();

    this.stompClient = new Client({
      connectHeaders: this.headers,
      debug: !environment.production ? (msg => console.log(msg)) : undefined,
      reconnectDelay: 3000,
      connectionTimeout: 15000,
      webSocketFactory: () => new SockJS(`${environment.messengerServerUrl}/socket`),
    });

    this.stompClient.activate();
  }

  send<T>(path: string, body: T): void {
    this.stompClient.publish({
      destination: `/app/${path}`,
      body: JSON.stringify(body)
    });
  }

  ngOnDestroy(): void {
    if (this.stompClient.connected) {
      this.stompClient.deactivate();
    }
  }

  private getHeaders(): StompHeaders {
    return {
      Authorization: `Bearer ${this.token}`,
      // [this.csrfProvider.getHeaderName()]: this.csrfProvider.getToken()
    };
  }
}
