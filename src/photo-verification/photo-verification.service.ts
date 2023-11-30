

import { Injectable } from '@nestjs/common';
import { PythonShell } from 'python-shell';
import { promises as fs } from 'fs';
import * as path from 'path';
import { tmpdir } from 'os';


@Injectable()
export class VerificationService {
    async getVerification(file: Express.Multer.File): Promise<any> {
        const fileName = `${Date.now()}.txt`;
        const tempFilePath = path.join(process.cwd(), "src", "verify_temp", fileName);

        try {
            await fs.mkdir(path.dirname(tempFilePath), { recursive: true });
            await fs.writeFile(tempFilePath, file.buffer.toString('base64'), 'utf8');

            let options = {
                scriptPath: '',
                args: [tempFilePath],
            };

            const message = await new Promise((resolve, reject) => {
                PythonShell.run('Demo/validFace.py', options).then(message => {
                    console.log(message);
                    resolve({ result: message[0] });
                });
            });
        } catch (error) {
            console.error('Error in VerificationService:', error);
            throw error;
        } finally {
            await fs.unlink(tempFilePath);
        }
    }
}
