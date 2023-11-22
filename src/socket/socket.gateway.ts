// video-stream.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PythonShell } from 'python-shell';


@WebSocketGateway({
    cors: {
        origin: '*'
    }
})


export class SocketGateway {
    @WebSocketServer()
    server: Server;


    @SubscribeMessage('stream')
    handleStream(client: Socket, imageBlob: Buffer): void {
        // imageBlob의 크기를 바이트 단위로 확인
        const sizeInBytes = Buffer.byteLength(imageBlob);
        //console.log(`imageBlob Receivesize: ${sizeInBytes} bytes`);

        if (imageBlob) {
            let options = {
                scriptPath: '',// 스크립트가 위치한 경로
                args: [imageBlob.toString('base64')], // Python 스크립트에 전달할 인자들
            };

            // Python 스크립트 실행
            PythonShell.run('Demo/test.py', options).then(messages => console.log(messages))
        }
    }

}




