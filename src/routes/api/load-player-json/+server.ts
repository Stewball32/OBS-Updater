import { promises as fs } from 'fs';
import { join } from 'path';

export async function GET() {
    try {
        const filePath = join(process.cwd(), 'static', 'playerlist.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);

        // Create and return a new Response object
        return new Response(JSON.stringify(jsonData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        // Create and return a new Response object with an error message
        return new Response(JSON.stringify({ error: 'Failed to read the JSON file.' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
