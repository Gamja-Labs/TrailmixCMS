import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FastifyReply } from 'fastify';
import { ZodSerializationException } from 'nestjs-zod';
import { ZodError } from 'zod';

@Catch(Error)
export class HttpExceptionFilter extends BaseExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: ZodSerializationException | HttpException | Error, host: ArgumentsHost) {
        if (exception instanceof ZodSerializationException) {
            const zodError = exception.getZodError();
            if (zodError instanceof ZodError) {
                this.logger.error(`ZodSerializationException: ${zodError.message}`);
            }
            return;
        }
        if (exception instanceof HttpException) {
            super.catch(exception, host);
            return;
        }

        // Handle other types of exceptions
        this.logger.error(exception.stack);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();

        // TODO: Record these errors somewhere
        response.status(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'An internal server error has occurred.',
        });

        super.catch(exception, host);
    }
}