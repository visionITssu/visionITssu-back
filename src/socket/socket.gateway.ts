// video-stream.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PythonShell } from 'python-shell';
import * as fs from 'fs';
import * as path from 'path';
import * as tf from "@tensorflow/tfjs-node";


@WebSocketGateway(5003, {
    namespace: 'socket',
    cors: { origin: '*' },
})


export class SocketGateway {
    @WebSocketServer()
    server: Server;
    model: tf.GraphModel;
    constructor() {
        this.loadModel();
    }

    async handleDisconnect(client: Socket) {
        const directoryPath = path.join(process.cwd(), "src", "socket_temp")
        await fs.promises.rm(directoryPath, { recursive: true, force: true })
    }

    async loadModel() {
        try {
            const modelPath = path.join(process.cwd(), "best_web_model", "model.json");
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

    @SubscribeMessage('stream')
    async handleStream(@ConnectedSocket() client: Socket, @MessageBody() message: any): Promise<any> {
        const imageBlob = message.image.replace(/^data:image\/\w+;base64,/, ""); // 'data:image/jpeg;base64,' 접두어 제거

        const fileName = `${Date.now()}.txt`;
        const tempFilePath = path.join(process.cwd(), "src", "socket_temp", fileName);
        await fs.promises.mkdir(path.dirname(tempFilePath), { recursive: true });
        await fs.promises.writeFile(tempFilePath, imageBlob.toString('base64'), 'utf8');



        if (imageBlob) {
            let options = {
                scriptPath: '',// 스크립트가 위치한 경로
                args: [tempFilePath], // Python 스크립트에 전달할 인자들
            };

            const arr = [];

            // for first data
            const imageBlob = message.image.replace(/^data:image\/\w+;base64,/, "");
            const imageBuffer = Buffer.from(imageBlob, 'base64');
            let tensor = tf.node.decodeImage(imageBuffer, 3);
            tensor = tf.image.resizeBilinear(tensor, [640, 640]);
            tensor = tensor.expandDims(0);
            tensor = tensor.div(tf.scalar(255));
            const prediction = await this.model.executeAsync(tensor);
            const tensors = prediction;
            const firstData = this.checkAllTensorsKept(tensors);
            arr.push(firstData);

            // for second data
            const pythonShell = await PythonShell.run('Demo/validFace.py', options);
            const secondData = pythonShell[0].match(/-?\d+/g).map(Number);
            arr.push(...secondData);
            console.log(arr);
            client.emit('stream', arr);
        }
    }
}
