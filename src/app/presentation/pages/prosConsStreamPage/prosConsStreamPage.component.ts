import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MyMessageComponent } from '@components/chat-bubbles/myMessage/myMessage.component';
import {
  ChatMessageComponent,
  TextMessageBoxComponent,
} from '@components/index';
import { TypingLoaderComponent } from '@components/typingLoader/typingLoader.component';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-pros-cons-stream-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './prosConsStreamPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsStreamPageComponent {
  public messages = signal<Message[]>([{ text: 'Hola Mundo', isGpt: false }]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  public abortController = signal(new AbortController());

  async handleMessage(prompt: string) {
    this.abortController().abort();
    this.abortController.set(new AbortController());
    
    this.isLoading.set(true);

    this.messages.update((prev) => [
      ...prev,
      { isGpt: false, text: prompt },
      { isGpt: true, text: '...' },
    ]);

    const stream = this.openAiService.checkProsConsStream(prompt, this.abortController().signal);

    for await (const text of stream) {
      this.handleStreamResponse(text);
    }

    this.isLoading.set(false);
  }

  handleStreamResponse(message: string) {
    this.messages().pop();
    const messages = this.messages();
    this.messages.set([...messages, { isGpt: true, text: message }]);
  }

  handleAbortStream() {
    this.abortController().abort();
    this.isLoading.set(false);
  }
}
