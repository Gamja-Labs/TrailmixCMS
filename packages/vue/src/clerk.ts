import { watch } from 'vue';
import type { Ref } from 'vue';

/**
 * The vue router navigation guard runs immediately on page load
 * so we need to wait for Clerk to load before we can check
 * if the user is signed in.
 */
export async function waitForClerkJsLoaded(isLoaded: Ref<boolean>) {
    return new Promise<void>(resolve => {
        const unwatch = watch(isLoaded, value => {
            if (value) {
                unwatch();
                resolve();
            }
        });
    });
}