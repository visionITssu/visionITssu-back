import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { PythonShell } from 'python-shell';

@Injectable()
export class PhotoEditService {
  //프론트에서 받아온 사진을 파이썬으로
  async getEdit(file: Express.Multer.File): Promise<any> {
    // 파일의 버퍼를 Base64 문자열로 변환
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.txt`;
    const tempFilePath = path.join(process.cwd(), "src", "verify_temp", fileName);

    try {
      await fs.mkdir(path.dirname(tempFilePath), { recursive: true });
      await fs.writeFile(tempFilePath, file.buffer.toString('base64'), 'utf8');

      let options = {
        scriptPath: '', // 필요한 경우 파이썬 스크립트 경로 지정
        args: [tempFilePath],
      };

      const res = await new Promise((resolve, reject) => {
        PythonShell.run('Demo/edittest.py', options).then(message => {
          resolve({ result: message[0] });
        });
      });
      return res;
    } catch (error) {
      console.error('Error in VerificationService:', error);
      throw error;
    } finally {
      //await fs.unlink(tempFilePath);
    }
  }

}
