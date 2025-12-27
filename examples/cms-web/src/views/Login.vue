<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { SignInButton, ClerkLoaded } from '@clerk/vue';

useHead({
    title: 'Login | Trailmix',
})
</script>

<template>
    <div class="login-container">
        <ClientOnly>
            <ClerkLoaded>
                <div class="login-card">
                    <div class="login-card-header">
                        <h1 class="login-title">Welcome to Trailmix</h1>
                        <p class="login-description">
                            Sign in to your account to continue
                        </p>
                    </div>
                    <div class="login-card-content">
                        <SignInButton mode="modal">
                            <button class="login-button">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="16" 
                                    height="16" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    stroke-width="2" 
                                    stroke-linecap="round" 
                                    stroke-linejoin="round"
                                    class="login-icon"
                                >
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                    <polyline points="10 17 15 12 10 7"></polyline>
                                    <line x1="15" y1="12" x2="3" y2="12"></line>
                                </svg>
                                Sign In
                            </button>
                        </SignInButton>
                    </div>
                </div>
            </ClerkLoaded>
        </ClientOnly>
    </div>
</template>

<style scoped lang="scss">
@use '../styles/components.scss' as *;

.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: linear-gradient(135deg, hsl(var(--muted) / 0.2), hsl(var(--background)));
}

.login-card {
    @extend .card;
    width: 100%;
    max-width: 400px;
    padding: 0;
    overflow: hidden;
}

.login-card-header {
    @extend .card-header;
    text-align: center;
    padding: 1.5rem;
}

.login-title {
    @extend .card-title;
    margin: 0;
    font-size: 1.875rem;
    font-weight: 600;
    letter-spacing: -0.025em;
}

.login-description {
    @extend .card-description;
    margin-top: 0.75rem;
    margin-bottom: 0;
    font-size: 0.9375rem;
}

.login-card-content {
    @extend .card-content;
    padding: 1.5rem;
}

.login-button {
    @extend .btn;
    @extend .btn-primary;
    width: 100%;
    padding: 0.75rem 1.5rem;
    font-size: 0.9375rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover:not(:disabled) {
        opacity: 0.95;
    }
}

.login-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
}
</style>
