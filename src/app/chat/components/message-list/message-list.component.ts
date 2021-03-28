import { Component, OnInit } from '@angular/core';
import { MessageService } from '@core/service/message.service';
import { Message } from '@core/model/message.model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {

  constructor(
    private messageService: MessageService
  ) { }

  messagesById: Map<number, Message> = new Map();

  ngOnInit(): void {
    this.messageService.getAll()
      .subscribe(messages => {
        this.messagesById = messages
          .reduce((acc, m) => acc.set(m.id, m), this.messagesById);
      });
  }

  getMessages(): Message[] {
    return Array.from(this.messagesById.values());
  }

}
