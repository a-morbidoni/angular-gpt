import { OrthographyResponse } from '@interfaces/index';
import { environment } from 'environments/environment';

interface OrthographyUseCaseResponse extends OrthographyResponse {
  ok: boolean;
}

export const orthographyUseCase = async (prompt: string): Promise<OrthographyUseCaseResponse> => {
  try {
    const response = await fetch(
      `${environment.backendApi}/orthography-check`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!response.ok) {
      throw new Error('Error al corregir la ortografía');
    }

    const data: OrthographyResponse = await response.json();

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    return {
      ok: false,
      errors: [],
      userScore: 0,
      message: 'Error al corregir la ortografía',
    };
  }
};
