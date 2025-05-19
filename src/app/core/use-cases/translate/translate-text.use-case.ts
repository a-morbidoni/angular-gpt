import { environment } from 'environments/environment';
import type { TranslateTextResponse } from '@interfaces/index';

interface TranslateTextUseCaseResponse extends TranslateTextResponse {
  ok: boolean;
}

export const translateTextUseCase = async (
  prompt: string,
  lang: string
): Promise<TranslateTextUseCaseResponse> => {
  try {
    const response = await fetch(`${environment.backendApi}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ text: prompt, targetLanguage: lang }),
    });

    if (!response.ok) {
      throw new Error('Error al corregir la ortografía');
    }

    const { message }: TranslateTextResponse = await response.json();

    return {
      ok: true,
      message,
    };
  } catch (error) {
    return {
      ok: false,
      message: 'Error al traducir el texto',
    };
  }
};
