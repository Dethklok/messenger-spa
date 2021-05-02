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

  startEditingMessage(id: number): void {
    const message = this.messagesById.get(id);

    if (!message) {
      throw new Error(`The message for edit with id ${id} not found`);
    }

    this.editingMessageId = id;
    this.messageForm.setValue({ content: message.content });
  }

  sendMessage(): void {
    const dto: SaveMessageDto = this.messageForm.value;
    const { content } = this.messageForm.value;

    this.editingMessageId
      ? this.messageService.update(this.editingMessageId, content)
      : this.messageService.save(content);

    this.messageForm.reset();
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

}
