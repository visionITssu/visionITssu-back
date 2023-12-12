import { Injectable } from '@nestjs/common';
import { PythonShell } from 'python-shell';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class VerificationService {
  model: tf.GraphModel;

  constructor() {
    this.loadModel();
  }

  async loadModel() {
    try {
      const modelPath = path.join(
        process.cwd(),
        'best_web_model',
        'model.json',
      );
      this.model = await tf.loadGraphModel(`file://${modelPath}`);
    } catch (error) {
      console.error('Error loading the model', error);
    }
  }
  checkAllTensorsKept(tensors) {
    // 배열 내의 모든 텐서가 kept === true 인지 확인
    const allKept = tensors.every((tensor) => tensor.kept);

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
    const tempFilePath = path.join(
      process.cwd(),
      'src',
      'verify_temp',
      fileName,
    );
    const arr = [];
    const score_arr = [];

    try {
      await fs.mkdir(path.dirname(tempFilePath), { recursive: true });
      await fs.writeFile(tempFilePath, file.buffer.toString('base64'), 'utf8');

      const imageBuffer = Buffer.from(file.buffer);
      const tensor = tf.node.decodeImage(imageBuffer, 3);
      const [modelWidth, modelHegiht] = this.model.inputs[0].shape.slice(1, 3);
      const input = tf.tidy(() => {
        return tf.image
          .resizeBilinear(tensor, [modelWidth, modelHegiht])
          .div(255.0)
          .expandDims(0);
      });

      try {
        const predictions = await this.model.executeAsync(input);
        //@ts-ignore
        const [boxes, scores, valid_detections] = predictions;
        const boxes_data = boxes.dataSync();
        const scores_data = scores.dataSync();
        //@ts-ignore
        const valid_detections_data = valid_detections.dataSync();
        for (let i = 0; i < valid_detections_data; i++) {
          boxes_data.slice(i * 4, (i + 1) * 4);
          score_arr.push(this.checkScore(scores_data[i].toFixed(2)));
        }
        const result = score_arr.every((value) => value !== 0) ? 1 : 0;
        arr.push(result);

        tf.dispose(tensor);
      } catch (error) {
        console.error('Error in YOLO model prediction:', error);
        throw error;
      }

      const options = {
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
