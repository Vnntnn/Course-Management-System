<script setup>
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons'
import smallbutton from '@/assets/button.vue'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { theme, toggleTheme } from '@/utils/theme'
import { useAuth } from '@/utils/auth'

const router = useRouter()
const { currentUser, isAuthenticated, logout, getCurrentUser } = useAuth()

const classes = computed(() => {
    const base = "flex fixed w-screen justify-between px-8 py-4 items-center shadow-lg z-10"
    const themes = {
        light: 'bg-bg-light-1',
        dark: 'bg-bg-dark-1'
    }
    return `${base} ${themes[theme.value]}`
})

const handleLogout = async () => {
    await logout()
    router.push('/')
}

const navigate = (path) => router.push(path)

onMounted(async () => {
    try {
        await getCurrentUser()
    } catch {
        // Not logged in
    }
})
</script>

<template>
    <header :class="classes">
        <h1
            class="text-xl font-bold hover:cursor-pointer"
            @click="navigate('/')"
        >
            Course<span class="text-ci-primary uppercase">wind</span>
        </h1>
        <div class="flex gap-4 items-center">
            <!-- Not logged in -->
            <div v-if="!isAuthenticated" class="flex gap-4">
                <smallbutton @click="navigate('/signup')">Sign Up</smallbutton>
                <smallbutton variant="primary_border" @click="navigate('/login')">
                    Log In
                </smallbutton>
            </div>
            <!-- Logged in -->
            <div v-else class="flex gap-4 items-center">
                <smallbutton variant="primary_border" @click="navigate('/browse')">
                    Browse Course
                </smallbutton>
                <smallbutton
                    variant="primary_border"
                    size="small_squared"
                    @click="navigate('/dashboard')"
                >
                    <HugeiconsIcon :icon="icons.UserIcon" />
                </smallbutton>
                <smallbutton variant="primary_border" @click="handleLogout">
                    Logout
                </smallbutton>
            </div>
            <smallbutton variant="primary_border" @click="toggleTheme()">
                <HugeiconsIcon :icon="icons.Moon02Icon" :size="24" color="currentColor" />
            </smallbutton>
        </div>
    </header>
</template>