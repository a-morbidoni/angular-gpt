import { Injectable } from '@angular/core';
import {
    audioToTextUseCase,
  orthographyUseCase,
  prosConsStreamUseCase,
  prosConsUseCase,
  textToAudioUseCase,
  translateTextUseCase,
} from '@use-cases/index';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpenAiService {
  checkOrthography(prompt: string) {
    return from(orthographyUseCase(prompt));
  }

  checkProsCons(prompt: string) {
    return from(prosConsUseCase(prompt));
  }

  checkProsConsStream(prompt: string, abortSignal: AbortSignal) {
    return prosConsStreamUseCase(prompt, abortSignal);
  }

  translateText(prompt: string, lang: string) {
    return from(translateTextUseCase(prompt, lang));
  }

  textToAudio(prompt: string, voice: string) {
    return from(textToAudioUseCase(prompt, voice));
  }

  audioToText(file: File, prompt: string) {
    return from(audioToTextUseCase(file, prompt));
  }
}
