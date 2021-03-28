import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MessageListComponent } from './components/message-list/message-list.component';
import { ChatRoutingModule } from './chat-routing.module';


@NgModule({
  declarations: [MessageListComponent],
  imports: [
    SharedModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
