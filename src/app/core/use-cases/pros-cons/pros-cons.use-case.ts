import { ProsConsResponse } from '@interfaces/index';
import { environment } from 'environments/environment';

interface ProsConsUseCaseResponse extends ProsConsResponse {
  ok: boolean;
}

export const prosConsUseCase = async (prompt: string): Promise<ProsConsUseCaseResponse> => {
  try {
    const response = await fetch(
      `${environment.backendApi}/pros-cons-discusser`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!response.ok) {
      throw new Error('Error al corregir la ortografía');
    }

    const data: ProsConsResponse = await response.json();

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    return {
      ok: false,
      content: '',
      role: '',
    };
  }
};
