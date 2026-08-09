const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logFilePath = path.join(__dirname, '..', 'ExecutionLog.txt');
    }

    log(message) {
        try {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] - ${message}\n`;
            fs.appendFileSync(this.logFilePath, logMessage, 'utf8');
        } catch (error) {
            console.error(`Logger Error: ${error.message}`);
        }
    }
}

module.exports = new Logger();
