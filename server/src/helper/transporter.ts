/**
 * Purpose of this class is to provide a wrapper for comms between frontend/backend communication.
 * Simple functions exist to wrap returns for "success" or "Failure" conditions, as well as simple data exchange
 * 
 * @Author: Bjorn Macintosh
 * @Date: 20181211
 * 
 */
class Transporter {
    postback: any;
    _data: Object;

    constructor() {
        this._data = {};
    }

    /**
     * builds out a standard response to callbacks
     * Includes statusCode which is a standard HTTP header response code 200, 404 et al.
     */
    buildReturn() {
        return {
            statusCode: 200,
            success: false,
            body: this._data
        };
    }

    /**
     * Responds to the callback with simple status code and data
     * 
     * @param {boolean} code boolean true = success, false = failure - used to define if the request was successful or not.
     * @param {Object} data {optional} The data that you want to return to the caller - merged with any data from previous setter calls
     */
    respond(code: boolean, data?: Object) {
        this.data = data;
        
        this.postback = this.buildReturn();
        this.postback.success = code;

        return this.postback;
    }
    
    /**
     * Sets the data being stored in the buffer for return to client on call to respond
     * 
     * @param {Object} data key/value object that will be merged into the existing object
     */
    set data(data: Object) {
        if (data instanceof Object) {
            let keys = Object.keys(data);
            keys.forEach((key) => {
                this._data[key] = data[key];
            });
        }
    }

    /**
     * Simple get for local data buffer
     */
    get data() {
        return this._data;
    }
}
    
interface postback {
    statusCode: Number,
    success: boolean,
    body: String
}

export default Transporter;