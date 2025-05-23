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
  TextMessageBoxFileComponent,
  TextMessageEvent,
  TypingLoaderComponent,
} from '@components/index';
import { AudioToTextResponse } from '@interfaces/audio-to-text.interface';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-audio-to-text-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxFileComponent,
  ],
  templateUrl: './audioToTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AudioToTextPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  handleMessageWithFile({ prompt, file }: TextMessageEvent) {
    const text = prompt ?? file.name ?? 'Transcribe the audio';
    this.isLoading.set(true);
    this.messages.update((prev) => [...prev, { text, isGpt: false }]);
    this.openAiService
      .audioToText(file, text)
      .subscribe((res) => this.handleResponse(res));
  }

  handleResponse(res: AudioToTextResponse | null) {
    this.isLoading.set(false);
    if (!res) return;
    const text = `## Transcripción:\n\n__Duración:__ ${Math.round(
      res.duration
    )} segundos.\n\n## **El texto es:** ${res.text}`;

    this.messages.update((prev) => [...prev, { text: text, isGpt: true }]);

    for (const segment of res.segments) {
      const segmentMessage = `
      __De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundos:__
      ${segment.text}`;
      this.messages.update((prev) => [
        ...prev,
        { text: segmentMessage, isGpt: true },
      ]);
    }
  }
}
