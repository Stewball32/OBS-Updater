import { promises as fs } from 'fs';
import { join } from 'path';

export async function GET() {
    try {
        const folderPath = join(process.cwd(), 'static', 'obs_files');
        let files = ["player1.txt", "player2.txt", "player3.txt", "player4.txt"]
        let names: {[key: string]: string} = {}

        await Promise.all(files.map(async (file) => {
          const filePath = join(folderPath, file);
          const fileContent = await fs.readFile(filePath, 'utf-8');
          names[file.split(".txt")[0]] = fileContent;
        }));

        // Create and return a new Response object
        return new Response(JSON.stringify(names), {
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
