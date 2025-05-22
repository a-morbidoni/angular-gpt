import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ChatMessageComponent,
  MyMessageComponent,
  TextMessageBoxEvent,
  TextMessageBoxSelectComponent,
  TypingLoaderComponent,
} from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-text-to-audio-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './textToAudioPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TextToAudioPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  readonly voices = signal<{ id: string; text: string }[]>([
    { text: 'Alloy', id: 'alloy' },
    { text: 'Echo', id: 'echo' },
    { text: 'Fable', id: 'fable' },
    { text: 'Onyx', id: 'onyx' },
    { text: 'Nova', id: 'nova' },
    { text: 'Shimmer', id: 'shimmer' },
    { text: 'Sage', id: 'sage' },
  ]);

  handleMessageWithSelect({ prompt, selectedOption }: TextMessageBoxEvent) {
    const message = `${selectedOption} - ${prompt}`;
    this.messages.update((prev) => [...prev, { text: message, isGpt: false }]);
    this.isLoading.set(true);

    this.openAiService
      .textToAudio(message, selectedOption)
      .subscribe(({ message, audioUrl }) => {
        this.isLoading.set(false);
        this.messages.update((prev) => [
          ...prev,
          { text: message, audioUrl, isGpt: true },
        ]);
      });
  }
}
