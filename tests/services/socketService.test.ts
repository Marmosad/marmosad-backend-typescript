import {container} from "../../src/inversify.config";
import {SocketService} from "../../src/services/socketServices";
import {} from "ts-jest"
import {Http} from "../../src/services/httpSingletonService";
import * as io_client from "socket.io-client"

const HTTP_ROOT = 'http://localhost:8081/';
let socketA: SocketService;
let client1;
let client2;
describe('Singleton test', () => {
    afterEach(() => {
        socketA.stop();
        if (client1) {
            client1.disconnect();
        }
        if (client2) {
            client2.disconnect();
        }

    });
    it('should connect', done => {
            container.get<Http>(Http).httpStart().then(() => {
                let http = container.get<Http>(Http).httpServer;
                socketA = container.resolve(SocketService);
                socketA.start('a');
                socketA.io.on('connection', function (socket: any) {
                    console.log('[TEST EVENT] Player: ' + socket.handshake.query.name + ' joined.')
                    expect(socket.handshake.query.name).toEqual('1')
                    done()
                });
                console.log(HTTP_ROOT);
                client1 = io_client(HTTP_ROOT, {
                    query: 'name=' + "1",
                    path: '/a'
                });
            })
        }
    );
});