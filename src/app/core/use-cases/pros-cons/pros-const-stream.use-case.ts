import { environment } from 'environments/environment';

// vamos a trabajar este nmetodo con una funcion generadora 
//documentacion: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*

export async function* prosConsStreamUseCase(prompt: string, abortSignal: AbortSignal) {
  try {
    const response = await fetch(
      `${environment.backendApi}/pros-cons-discusser-stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        signal: abortSignal,
      }
    );

    if (!response.ok) {
      throw new Error('error en la respuesta');
    }

    const reader = response.body?.getReader();

    if (!reader) {
      console.log('no se pudo generar el reader', response);
      throw new Error('no se pudo generar el reader');
    }

    const decoder = new TextDecoder();
    let text = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const decodedChunk = decoder.decode(value, { stream: true });
      text += decodedChunk;
      yield text;
    }

    return text;
  } catch (error) {
    return null;
  }
};
