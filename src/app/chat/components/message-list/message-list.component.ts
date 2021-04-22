import { Component, OnInit } from '@angular/core';
import { MessageService } from '@core/service/message.service';
import { Message } from '@core/model/message.model';
import { FormBuilder, Validators } from '@angular/forms';
import { SaveMessageDto } from '@core/dto/save-message.dto';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {
  }

  messagesById: Map<number, Message> = new Map();

  editingMessageId: number | null = null;

  messageForm = this.formBuilder.group({
    content: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadMessages();
    this.subscribeToMessages();
  }

  getMessages(): Message[] {
    return Array.from(this.messagesById.values());
  }

  sendMessage(): void {
    const dto: SaveMessageDto = this.messageForm.value;
    this.messageService.save(dto);
  }

  deleteMessage(id: number): void {
    this.messageService.delete(id).subscribe(() => this.deleteMessage(id));
  }

  private loadMessages(): void {
    this.messageService.getAll().subscribe(messages => {
      this.messagesById = messages
        .reduce((acc, message) => acc.set(message.id, message), this.messagesById);
    });
  }

  private subscribeToMessages(): void {
    this.messageService.subscribe((message) => this.messagesById.set(message.id, message));
  }

  private addMessage(message: Message): void {
    this.messagesById.set(message.id, message);
  }

  private getMessage(id: number): Message {
    const message = this.messagesById.get(id);

    if (message === undefined) {
      throw new Error(`Message with id ${id} not found`);
    }

    return message;
  }

}
