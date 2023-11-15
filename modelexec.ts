import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class ModelService {
  runPythonScript() {
    exec('python3 Demo/test.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`Python Output: ${stdout}`);
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
    });
  }
}
