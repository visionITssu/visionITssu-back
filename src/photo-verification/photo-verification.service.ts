// import { Injectable } from '@nestjs/common';
// import { PythonShell } from 'python-shell';

// @Injectable()
// export class VerificationService {
//     getVerification(res): any {
//         console.log(res);
//         // let options = {
//         //     scriptPath: '',// 스크립트가 위치한 경로
//         //     args: [res.image.toString('base64')], // Python 스크립트에 전달할 인자들
//         // };
//         // PythonShell.run('Demo/test.py', options).then(message => {
//         //     //const output = JSON.parse(message); // Python 출력 파싱
//         //     //this.dataList.push(output); // 리스트에 데이터 추가
//         //     // 프론트엔드에 데이터 전송
//         //     //this.server.emit('streamData', output);
//         //     console.log(message);
//         // });
//     }
// }




// import { Injectable } from '@nestjs/common';
// import { PythonShell } from 'python-shell';

// @Injectable()
// export class VerificationService {
//     getVerification(file: Express.Multer.File): any {
//         // console.log(file);

//         let options = {
//             scriptPath: '', // The path where your Python script is located
//             args: [file.buffer.toString('base64')], // Passing the image as a base64 string to the Python script
//         };

//         return new Promise((resolve, reject) => {
//             PythonShell.run('Demo/validFace.py', options).then(message => {

//                 // Assuming message[1] contains the desired data
//                 console.log(message);
//                 resolve({ result: message[0] });

//             }).catch((err) => console.log("error" + err))
//         });
//     }
// }

import { Injectable } from '@nestjs/common';
import { PythonShell } from 'python-shell';
import { promises as fs } from 'fs';
import * as path from 'path';
import { tmpdir } from 'os';


@Injectable()
export class VerificationService {
    async getVerification(file: Express.Multer.File): Promise<any> {
        const fileName = `${Date.now()}.txt`;
        const tempFilePath = path.join(process.cwd(), "src", "temp", fileName);

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
