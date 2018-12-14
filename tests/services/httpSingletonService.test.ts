import {FirestoreService} from "../../src/services/firestoreService";
import {container} from "../../src/inversify.config";
import {inject, injectable, interfaces} from "inversify";
import {Http, HttpInterface} from "../../src/services/httpSingletonService";
import {} from "ts-jest"
import * as uuid4 from "uuid/v4"

@injectable()
class TestClass {
    public uid;
    constructor(private http: Http) {
        this.uid = uuid4()
    }

    get uuid() {
        return this.http.uuid;
    }
}

describe('Singleton test', () => {
    container.bind(TestClass).toSelf();
    let testClass1 = container.resolve(TestClass);
    let testClass2 = container.resolve(TestClass);

    it('should be singleton', function () {
        expect(testClass1.uuid == testClass2.uuid).toBeTruthy();
    });
    it('should be different parent classes', function () {
        expect(testClass2.uid == testClass1.uid).toBeFalsy()
    });
});