

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
    checkScore(score) {
        const threshold = 0.5;
        //유효하지 않은 사진일 때
        if (score > threshold) {
            return 0;
        }
        return 1;
    }

    async getVerification(file: Express.Multer.File): Promise<any> {
        const fileName = `${Date.now()}.txt`;
        const tempFilePath = path.join(process.cwd(), "src", "verify_temp", fileName);
        const arr = [];
        const score_arr = [];

        try {
            await fs.mkdir(path.dirname(tempFilePath), { recursive: true });
            await fs.writeFile(tempFilePath, file.buffer.toString('base64'), 'utf8');

            const imageBuffer = Buffer.from(file.buffer);
            let tensor = tf.node.decodeImage(imageBuffer, 3);
            let [modelWidth, modelHegiht] = this.model.inputs[0].shape.slice(1, 3);
            const input = tf.tidy(() => {
                return tf.image.resizeBilinear((tensor), [modelWidth, modelHegiht]).div(255.0).expandDims(0);
            });


            try {
                const predictions = await this.model.executeAsync(input,);
                //console.log(predictions);
                // predictions[0].
                //@ts-ignore
                const [boxes, scores, classes, valid_detections] = predictions;
                const boxes_data = boxes.dataSync();
                const scores_data = scores.dataSync();
                const classes_data = classes.dataSync();
                //@ts-ignore
                const valid_detections_data = valid_detections.dataSync();
                //tf.dispose(predictions);
                var i;
                for (i = 0; i < valid_detections_data; i++) {
                    let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
                    console.log(classes_data[i]);
                    console.log(scores_data[i].toFixed(2));

                    score_arr.push(this.checkScore(scores_data[i].toFixed(2)));

                }
                let result = score_arr.every(value => value !== 0) ? 1 : 0;
                //console.log(result);
                arr.push(result);

                // predictions 결과를 처리하고 반환
                // 예를 들어, bounding box 정보, 클래스 등
                // const firstData = this.checkAllTensorsKept(predictions);
                // arr.push(firstData);

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
