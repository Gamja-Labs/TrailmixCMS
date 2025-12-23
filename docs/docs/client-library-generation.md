# Client Library Generation

Trailmix CMS generates OpenAPI/Swagger documentation automatically from your Zod schemas via `@nestjs/swagger`. You can use this OpenAPI specification to generate type-safe client libraries for your frontend applications.

## Generating the OpenAPI Specification

Before generating a client library, you need to generate the OpenAPI specification JSON file. Trailmix CMS applications include a built-in mechanism to help generate this file.

### Using the GENERATE_SPEC Flag

When you run your NestJS application with the `GENERATE_SPEC` environment variable set, the application will generate the OpenAPI specification JSON file and exit:

```bash
GENERATE_SPEC=true yarn start
```

This will create an `api-json.json` file in your `docs/` directory (or the configured output path) containing the complete OpenAPI specification for your API.

> This requires some custom code in your bootstrap, see the example projects main.ts

## Generating Client Libraries

Once you have the OpenAPI specification JSON file, you can use it to generate type-safe client libraries. We recommend using one of the following tools:

### swagger-typescript-api

[swagger-typescript-api](https://github.com/acacode/swagger-typescript-api) is a popular npm module that generates TypeScript API clients from OpenAPI specifications.

For installation and usage instructions, see the [swagger-typescript-api GitHub repository](https://github.com/acacode/swagger-typescript-api).

### openapi-generator-cli

[openapi-generator-cli](https://github.com/OpenAPITools/openapi-generator-cli) is a CLI wrapper around OpenAPI Generator, which supports generating clients in many languages and frameworks.

For installation and usage instructions, see the [openapi-generator-cli GitHub repository](https://github.com/OpenAPITools/openapi-generator-cli).

