

import { Injectable } from '@nestjs/common';
import { PythonShell } from 'python-shell';
import { promises as fs } from 'fs';
import * as path from 'path';
import { tmpdir } from 'os';
import * as tf from "@tensorflow/tfjs-node";



@Injectable()
export class VerificationService {
    model: tf.GraphModel;

    constructor() {
        this.loadModel();
    }

    async loadModel() {
        try {
            const modelPath = path.join(process.cwd(), "model", "model.json");
            this.model = await tf.loadGraphModel(`file://${modelPath}`);
        } catch (error) {
            console.error("Error loading the model", error);
        }
    }
    checkAllTensorsKept(tensors) {
        // 배열 내의 모든 텐서가 kept === true 인지 확인
        const allKept = tensors.every(tensor => tensor.kept);

        // 모든 텐서가 kept === true 이면 1 반환, 아니면 다른 값을 반환 (예: 0)
        return allKept ? 1 : 0;
    }


    async getVerification(file: Express.Multer.File): Promise<any> {
        const fileName = `${Date.now()}.txt`;
        const tempFilePath = path.join(process.cwd(), "src", "verify_temp", fileName);
        const arr = [];

        try {
            await fs.mkdir(path.dirname(tempFilePath), { recursive: true });
            await fs.writeFile(tempFilePath, file.buffer.toString('base64'), 'utf8');

            const imageBuffer = Buffer.from(file.buffer);
            let tensor = tf.node.decodeImage(imageBuffer, 3);
            tensor = tf.image.resizeBilinear(tensor, [640, 640]);
            tensor = tensor.expandDims(0);
            tensor = tensor.div(tf.scalar(255));

            try {
                const predictions = await this.model.executeAsync(tensor);
                // predictions 결과를 처리하고 반환
                // 예를 들어, bounding box 정보, 클래스 등
                const firstData = this.checkAllTensorsKept(predictions);
                arr.push(firstData);

                // Tensor 메모리 해제
                tf.dispose(tensor);
            } catch (error) {
                console.error('Error in YOLO model prediction:', error);
                throw error;
            }

            let options = {
                scriptPath: '',
                args: [tempFilePath],
            };

            const pythonShell = await PythonShell.run('Demo/validFace.py', options);
            const secondData = pythonShell[0].match(/-?\d+/g).map(Number);
            arr.push(...secondData);
            console.log(arr);
            return arr;
        } catch (error) {
            console.error('Error in VerificationService:', error);
            throw error;
        } finally {
            await fs.unlink(tempFilePath); // 임시 파일 삭제
        }
    }
}
