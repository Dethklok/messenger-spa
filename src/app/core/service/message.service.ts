import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '@core/model/message.model';
import { SaveMessageDto } from '@core/dto/save-message.dto';
import { WebsocketService } from '@core/service/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageEndpoint = `${environment.messengerServerUrl}/message`;

  constructor(
    private httpClient: HttpClient,
    private websocketService: WebsocketService
  ) {
  }

  getAll(): Observable<Message[]> {
    this.httpClient.get(`${environment.messengerServerUrl}/csrf`).subscribe((x) => console.log(x));
    return this.httpClient.get<Message[]>(this.messageEndpoint);
  }

  findOne(id: number): Observable<Message> {
    return this.httpClient.get<Message>(`${this.messageEndpoint}/${id}`);
  }

  save(messageDto: SaveMessageDto): void {
    // this.httpClient.post<Message>(this.messageEndpoint, messageDto);
    this.websocketService.send<SaveMessageDto>('saveMessage', messageDto);
  }

  update(id: number, messageDto: SaveMessageDto): Observable<Message> {
    return this.httpClient.put<Message>(`${this.messageEndpoint}/${id}`, messageDto);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.messageEndpoint}/${id}`);
  }
}
