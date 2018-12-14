import {container} from "../../src/inversify.config";
import {SocketService} from "../../src/services/socketServices";
import {} from "ts-jest"
import {Http} from "../../src/services/httpSingletonService";
import * as io from "socket.io-client"

const HTTP_ROOT = 'http://localhost:8081';
let socketA: SocketService;
let client1;
let client2;
describe('Singleton test', () => {

    afterEach(() => {
        socketA.stop();
        client1.disconnect();
        client2.disconnect();
    });
    it('should receive chat', done => {
            container.get<Http>(Http).httpStart().then(() => {
                let http = container.get<Http>(Http).http;
                socketA = container.resolve(SocketService);
                socketA.start('a');
                client1 = io(HTTP_ROOT, {
                    query: 'name=' + "1",
                    path: 'a'
                });
                client2 = io(HTTP_ROOT, {
                    query: 'name=' + "2",
                    path: 'a'
                });

                client1.emit('chat', 'sup');
                socketA.emitChat('a', '123');
                client2.on('chat', (data) => {
                    console.log(data);
                    expect(data).toBeTruthy();
                    done()
                });
            })
        }
    );
});