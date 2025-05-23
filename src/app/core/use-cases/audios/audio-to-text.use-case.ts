import { AudioToTextResponse } from '@interfaces/audio-to-text.interface';
import { environment } from 'environments/environment';

interface AudioToTextResponseDto extends AudioToTextResponse {
  ok: boolean;
  errors: string[];
}

export const audioToTextUseCase = async (
  audioFile: File,
  prompt?: string
): Promise<AudioToTextResponseDto | null> => {
  try {
    const formData = new FormData();
    formData.append('file', audioFile);

    if (prompt) {
      formData.append('prompt', prompt);
    }

    const response = await fetch(`${environment.backendApi}/audio-to-text`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'No se pudo generar el texto');
    }

    return { ok: true, ...data };
  } catch (error) {
    console.log(error);
    return null;
  }
};
