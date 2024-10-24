import assert from 'assert';
import sinon from 'sinon';
import {ZipWriter} from  "../../index.cjs" // Adjust the path as necessary


describe('ZipWriter', function() {
    let zipWriter;
    let addStub;

    beforeEach(function() {
        zipWriter = new ZipWriter();
        addStub = sinon.stub(zipWriter, 'add');
    });

    afterEach(function() {
        sinon.restore();
    });

    it('should fail when the promise returned by the 5th call to ZipWriter.add does not resolve', async function() {
        // Arrange
        const promises = [Promise.resolve(), Promise.resolve(), Promise.resolve(), Promise.resolve(), new Promise(() => {})];
        addStub.onCall(0).returns(promises[0]);
        addStub.onCall(1).returns(promises[1]);
        addStub.onCall(2).returns(promises[2]);
        addStub.onCall(3).returns(promises[3]);
        addStub.onCall(4).returns(promises[4]);

        // Act
        const addPromises = [];
        for (let i = 0; i < 5; i++) {
            addPromises.push(zipWriter.add(`file${i}.txt`));
        }

        // Assert
        try {
            await Promise.all(addPromises);
            assert.fail('Expected the promise to not resolve');
        } catch (error) {
            assert.ok(true, 'Promise did not resolve as expected');
        }
    });
});