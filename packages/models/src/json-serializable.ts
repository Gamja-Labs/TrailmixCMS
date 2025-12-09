import { z, ZodTypeAny, ZodSchema } from 'zod';
import { ObjectId } from 'bson';
import { ObjectIdRegex } from './utils/objectId';

/**
 * Recursively transforms a Zod schema to make it JSON serializable.
 * Converts non-serializable types like ObjectId and Date to string equivalents.
 * 
 * @param schema - The Zod schema to transform
 * @returns A new Zod schema that is JSON serializable
 */
export function toJsonSerializable<T extends ZodTypeAny>(schema: T): ZodSchema<any> {
    const typeName = (schema as any)._def?.typeName;
    
    // Handle ZodObject
    if (typeName === 'ZodObject') {
        const shape = (schema as any).shape;
        const newShape: Record<string, ZodTypeAny> = {};
        
        for (const [key, value] of Object.entries(shape)) {
            newShape[key] = toJsonSerializable(value as ZodTypeAny);
        }
        
        return z.object(newShape);
    }
    
    // Handle ZodArray
    if (typeName === 'ZodArray') {
        return z.array(toJsonSerializable((schema as any).element));
    }
    
    // Handle ZodOptional
    if (typeName === 'ZodOptional') {
        return toJsonSerializable((schema as any).unwrap()).optional();
    }
    
    // Handle ZodNullable
    if (typeName === 'ZodNullable') {
        return toJsonSerializable((schema as any).unwrap()).nullable();
    }
    
    // Handle ZodDefault
    if (typeName === 'ZodDefault') {
        const innerSchema = (schema as any).removeDefault();
        const defaultValue = (schema as any)._def.defaultValue();
        return toJsonSerializable(innerSchema).default(defaultValue);
    }
    
    // Handle ZodUnion
    if (typeName === 'ZodUnion') {
        const options = (schema as any).options.map((opt: ZodTypeAny) => toJsonSerializable(opt));
        return z.union(options as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]);
    }
    
    // Handle ZodIntersection
    if (typeName === 'ZodIntersection') {
        return z.intersection(
            toJsonSerializable((schema as any)._def.left),
            toJsonSerializable((schema as any)._def.right)
        );
    }
    
    // Handle ZodTuple
    if (typeName === 'ZodTuple') {
        const items = (schema as any).items.map((item: ZodTypeAny) => toJsonSerializable(item));
        return z.tuple(items as [ZodTypeAny, ...ZodTypeAny[]]);
    }
    
    // Handle ZodRecord
    if (typeName === 'ZodRecord') {
        const valueSchema = (schema as any).valueSchema;
        return z.record(z.string(), toJsonSerializable(valueSchema));
    }
    
    // Handle ZodMap
    if (typeName === 'ZodMap') {
        return z.map(
            toJsonSerializable((schema as any).keySchema),
            toJsonSerializable((schema as any).valueSchema)
        );
    }
    
    // Handle ZodSet
    if (typeName === 'ZodSet') {
        return z.set(toJsonSerializable((schema as any).valueSchema));
    }
    
    // Handle ZodLazy (recursive schemas)
    if (typeName === 'ZodLazy') {
        return z.lazy(() => toJsonSerializable((schema as any)._def.getter()));
    }
    
    // Handle ZodEffects (refinements, transforms, etc.)
    if (typeName === 'ZodEffects') {
        // For effects, we transform the inner schema but lose the effects
        // This is intentional as effects may not be JSON serializable
        return toJsonSerializable((schema as any).innerType());
    }
    
    // Handle ZodDiscriminatedUnion
    if (typeName === 'ZodDiscriminatedUnion') {
        const options = Object.values((schema as any).options).map((opt: any) => toJsonSerializable(opt as ZodTypeAny));
        return z.union(options as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]);
    }
    
    // Handle ZodInstanceof - convert ObjectId to string
    if (typeName === 'ZodInstanceof') {
        const classType = (schema as any)._def.class;
        if (classType === ObjectId) {
            return z.string().regex(ObjectIdRegex);
        }
        // For other instanceof types, convert to unknown (not ideal but preserves structure)
        return z.unknown();
    }
    
    // Handle ZodDate - convert to ISO datetime string
    if (typeName === 'ZodDate') {
        // Use iso.datetime() for Zod 4.x compatibility
        return z.iso.datetime();
    }
    
    // Handle ZodEnum, ZodNativeEnum, ZodLiteral, ZodString, ZodNumber, ZodBoolean, ZodNull, ZodUndefined, ZodVoid, ZodAny, ZodUnknown
    // These are already JSON serializable, so return as-is
    return schema as ZodSchema<any>;
}
