import { promises as fs } from 'fs';
import { join } from 'path';

type RequestEvent<T = any, Body = any> = {
    body: Body;
    headers: Record<string, string>;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    query: Record<string, any>;
    locals: any;
    path: string;
    request: {
        body: ReadableStream;
        [key: string]: any;
    };
};

async function readStream(stream: ReadableStream): Promise<string> {
    let result = '';
    const reader = stream.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        result += new TextDecoder().decode(value);
    }
    return result;
}

export async function POST(request: RequestEvent): Promise<Response> {
  try {
      const rawBody = await readStream(request.request.body);
      const parsedBody = JSON.parse(rawBody);

      const saveToPath = join(process.cwd(), parsedBody.destination);
      await fs.writeFile(saveToPath, parsedBody.content, 'utf-8');

      const headers = { 'Content-Type': 'application/json' };
      const body = JSON.stringify({ message: 'File saved successfully!' });
      return new Response(body, { status: 200, headers });
  } catch (error: any) {
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
          errorMessage = error.message;
      }
      const headers = { 'Content-Type': 'application/json' };
      const body = JSON.stringify({ error: errorMessage });
      return new Response(body, { status: 500, headers });
  }
}
