import { str, bool, cleanEnv } from 'envalid';

export const configuration = () => {
    const config = cleanEnv(process.env, {
        MONGODB_CONNECTION_STRING: str({
            desc: 'Connection string to mongodb',
            ...(process.env.GENERATE_SPEC === 'true' ? { default: '', allowEmpty: true } : {}),
        }),
        MONGODB_DATABASE_NAME: str({
            desc: 'Database Name',
            default: 'main'
        }),
        GENERATE_SPEC: bool({
            desc: 'Generate OpenAPI spec',
            default: false
        }),
    });
    return {
        ...config,
        onModuleInit: false // Fix issue where nestjs checks for onModuleInit hook and fails if it doesn't exist
    };
};

export type AppConfig = ReturnType<typeof configuration>;