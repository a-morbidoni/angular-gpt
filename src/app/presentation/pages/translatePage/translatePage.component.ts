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
  TextMessageBoxSelectComponent,
  TypingLoaderComponent,
} from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

interface TextMessageWithSelectEvent {
  prompt: string;
  selectedOption: string;
}
@Component({
  selector: 'app-translate-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './translatePage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TranslatePageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  public langOptions = signal<{ id: string; text: string }[]>([
    { id: 'alemán', text: 'Alemán' },
    { id: 'árabe', text: 'Árabe' },
    { id: 'bengalí', text: 'Bengalí' },
    { id: 'francés', text: 'Francés' },
    { id: 'hindi', text: 'Hindi' },
    { id: 'inglés', text: 'Inglés' },
    { id: 'japonés', text: 'Japonés' },
    { id: 'mandarín', text: 'Mandarín' },
    { id: 'portugués', text: 'Portugués' },
    { id: 'ruso', text: 'Ruso' },
  ]);

  public selectedLang = signal<string>('');

  handleMessageWithSelect({
    prompt,
    selectedOption,
  }: TextMessageWithSelectEvent): void {
    this.isLoading.set(true);
    this.messages.set([...this.messages(), { text: prompt, isGpt: false }]);
    this.openAiService
      .translateText(prompt, selectedOption)
      .subscribe((res) => {
        this.messages.set([
          ...this.messages(),
          { text: res.message, isGpt: true },
        ]);
        this.isLoading.set(false);
      });
  }
}
