import { Injectable } from '@angular/core';

import * as SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { Client, StompHeaders } from '@stomp/stompjs';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private readonly stompClient: Client;
  private readonly token: string;
  private readonly headers: StompHeaders;

  constructor(
    protected readonly keycloakService: KeycloakService,
  ) {
    const { token } = this.keycloakService.getKeycloakInstance();

    if (!token) {
      throw new Error('Error while creating WebsocketService: auth token not found!');
    }

    this.token = token;
    this.headers = this.getHeaders();
    console.log(this.headers);
    this.stompClient = new Client({
      brokerURL: `${environment.messengerServerUrl}/socket`,
      connectHeaders: this.headers,
      debug: !environment.production ? (msg => console.log(msg)) : undefined,
      reconnectDelay: 3000,
      connectionTimeout: 15000,
      webSocketFactory: () => new SockJS(`${environment.messengerServerUrl}/socket/?access_token=${this.token}`),
    });

    this.stompClient.activate();
  }

  isConnected(): boolean {
    return this.stompClient.connected;
  }

  send<T>(path: string, body: T): void {
    this.stompClient.publish({
      headers: this.headers,
      destination: `/app/${path}`,
      body: JSON.stringify(body)
    });
  }

  private getHeaders(): StompHeaders {
    return { Authorization: `Bearer ${this.token}` };
  }
}
