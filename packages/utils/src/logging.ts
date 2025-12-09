import { Logger } from '@nestjs/common';
import morgan from 'morgan';

const MORGAN_FORMAT = ':method :url :status :res[content-length] - :response-time ms';

export function requestLogger() {
    const logger = new Logger('Request');
    return morgan(MORGAN_FORMAT, {
        stream: {
            write: (message) => logger.debug(message.replace('\n', '')),
        },
    });
}
