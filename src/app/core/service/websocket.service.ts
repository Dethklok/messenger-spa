import { Injectable, OnDestroy } from '@angular/core';

import * as SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { Client, IMessage, StompHeaders } from '@stomp/stompjs';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {

  private readonly stompClient: Client;
  private readonly token: string;
  private readonly headers: StompHeaders;
  private subscribers: Map<string, (message: IMessage) => void>;

  constructor(
    private readonly keycloakService: KeycloakService,
  ) {
    const { token } = this.keycloakService.getKeycloakInstance();

    if (!token) {
      throw new Error('Error while creating WebsocketService: auth token not found!');
    }

    this.subscribers = new Map();
    this.token = token;
    this.headers = this.getHeaders();

    this.stompClient = new Client({
      connectHeaders: this.headers,
      debug: !environment.production ? (msg => console.log(msg)) : undefined,
      reconnectDelay: 3000,
      connectionTimeout: 15000,
      webSocketFactory: () => new SockJS(`${environment.messengerServerUrl}/socket`),
      onConnect: () => Array.from(this.subscribers.entries()).every(([path, callback]) => this.stompClient.subscribe(path, callback)),
    });

    this.stompClient.activate();
  }

  publish<T>(path: string, body: T): void {
    this.stompClient.publish({
      destination: `/app/${path}`,
      body: JSON.stringify(body)
    });
  }

  subscribe<T>(path: string, callback: (body: T) => void): void {
    const destination = `/topic/${path}`;

    this.subscribers.set(destination, (message => {
      if (message.body) {
        callback(JSON.parse(message.body));
      }
    }));
  }

  ngOnDestroy(): void {
    if (this.stompClient.connected) {
      this.stompClient.deactivate();
    }
  }

  private getHeaders(): StompHeaders {
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }
}
