import { Api } from '@/client/Api';
import { useAuth } from '@clerk/vue';
import { waitForClerkJsLoaded } from '@trailmix-cms/vue';

export function useApi() {
    const { getToken, isLoaded } = useAuth();
    const api = new Api({
        baseUrl: import.meta.env.VITE_SERVICE_HOST,
        securityWorker: async () => {
            if (!isLoaded.value) {
                await waitForClerkJsLoaded(isLoaded);
            }
            const token = await getToken.value();
            if (token) {
                return {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
            }
            return {};
        },
    });

    return {
        api,
    };
}