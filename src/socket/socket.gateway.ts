// video-stream.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PythonShell } from 'python-shell';
import * as fs from 'fs';

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})


export class SocketGateway {
    @WebSocketServer()
    server: Server;
    dataList: any;


    @SubscribeMessage('stream')
    handleStream(client: Socket, imageBlob: Buffer): void {
        // imageBlob의 크기를 바이트 단위로 확인
        // const sizeInBytes = Buffer.byteLength(imageBlob);
        //console.log(`imageBlob Receivesize: ${sizeInBytes} bytes`);

        if (imageBlob) {
            let options = {
                scriptPath: '',// 스크립트가 위치한 경로
                args: [imageBlob.toString('base64')], // Python 스크립트에 전달할 인자들
            };

            PythonShell.run('Demo/validFace.py', options).then(messages => console.log(messages))

            // PythonShell.run('Demo/test.py', options).then(message => {
            //     const output = JSON.parse(message[0]); // Python 출력 파싱
            //     this.dataList.push(output); // 리스트에 데이터 추가
            //     // 프론트엔드에 데이터 전송
            //     this.server.emit('streamData', output);
            // });


        }
    }
}
