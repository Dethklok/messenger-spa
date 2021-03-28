import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '@core/model/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messengerServerUrl = environment.messengerServerUrl;

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  getAll(): Observable<Message[]> {
    return this.httpClient.get<Message[]>(`${this.messengerServerUrl}/message`);
  }
}
