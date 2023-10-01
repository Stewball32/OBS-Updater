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
        const newNames = JSON.parse(rawBody);

        await Promise.all(Object.entries(newNames).map(async ([key, value]: [string, unknown]) => {
          if (typeof value === 'string' && value.trim() !== '') {
              const filePath = join(process.cwd(), 'static', 'obs_files', `${key}.txt`);
              await fs.writeFile(filePath, value.trim(), 'utf8');
          }
      }));

        const headers = { 'Content-Type': 'application/json' };
        const body = JSON.stringify({
            success: true,
            message: 'Names updated successfully!'
        });
        return new Response(body, { status: 200, headers });
    } catch (error: any) {
        console.error('Error in POST /api/post-obs-names:', error);

        let errorMessage = 'An unexpected error occurred.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        const headers = { 'Content-Type': 'application/json' };
        const body = JSON.stringify({
            success: false,
            message: errorMessage
        });
        return new Response(body, { status: 500, headers });
    }
}
