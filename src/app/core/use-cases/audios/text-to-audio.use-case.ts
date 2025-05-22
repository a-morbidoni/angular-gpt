import { OrthographyResponse, TextToAudio } from '@interfaces/index';
import { environment } from 'environments/environment';

interface TextToAduioUseCaseResponse {
  ok: boolean;
  message: string;
  audioUrl?: string;
  errors?: string[];
}

export const textToAudioUseCase = async (
  prompt: string,
  voice: string
): Promise<TextToAduioUseCaseResponse> => {
  try {
    const response = await fetch(`${environment.backendApi}/text-to-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ prompt, voice }),
    });

    if (!response.ok) {
      throw new Error('No se pudo generar el audio');
    }

    const audioFile = await response.blob();
    const audioUrl = URL.createObjectURL(audioFile);

    return {
      ok: true,
      message: prompt,
      audioUrl,
    };
  } catch (error) {
    return {
      ok: false,
      errors: [],
      audioUrl: '',
      message: 'Error al corregir la ortografía',
    };
  }
};
