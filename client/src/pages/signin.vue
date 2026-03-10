<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { HugeiconsIcon, Home03Icon, StudentIcon, TeacherIcon } from '@/utils/icons'
const icons = { Home03Icon, StudentIcon, TeacherIcon }
import Button from '@/assets/button.vue'
import inputtext from '@/assets/inputtext.vue'
import { useAuth } from '@/utils/auth'

const router = useRouter()
const { register, isLoading, error } = useAuth()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('student')
const formError = ref('')

const handleSignup = async () => {
    formError.value = ''

    if (!firstName.value || !lastName.value || !email.value || !password.value || !confirmPassword.value) {
        formError.value = 'Please fill in all fields'
        return
    }

    if (password.value.length < 8 || password.value.length > 20) {
        formError.value = 'Password must be 8-20 characters'
        return
    }

    if (password.value !== confirmPassword.value) {
        formError.value = 'Passwords do not match'
        return
    }

    try {
        const fullName = `${firstName.value} ${lastName.value}`
        await register(email.value, password.value, fullName, role.value)
        router.push('/dashboard')
    } catch (err) {
        formError.value = error.value || 'Signup failed. Please try again.'
    }
}

const goHome = () => router.push('/')
const goLogin = () => router.push('/login')
</script>

<template>
    <main class="flex items-center justify-center min-h-screen flex-col">
        <Button
            variant="primary_border"
            class="fixed top-24 left-4 flex gap-2"
            @click="goHome"
        >
            <HugeiconsIcon :icon="icons.Home03Icon" />
            Back to homepage
        </Button>

        <form @submit.prevent="handleSignup" class="flex flex-col p-8 gap-5 w-96">
            <legend class="font-bold text-3xl text-center">Create Account</legend>

            <!-- User Info -->
            <div class="flex flex-col gap-2 w-full">
                <label for="firstname">First Name*</label>
                <inputtext
                    v-model="firstName"
                    id="firstname"
                    input_type="text"
                    input_placeholder="First Name"
                />

                <label for="lastname">Last Name*</label>
                <inputtext
                    v-model="lastName"
                    id="lastname"
                    input_type="text"
                    input_placeholder="Last Name"
                />

                <label for="email">Email*</label>
                <inputtext
                    v-model="email"
                    id="email"
                    input_type="email"
                    input_placeholder="example@gmail.com"
                />
            </div>

            <!-- Role Selector -->
            <div class="w-full border rounded-lg inline-flex overflow-hidden">
                <div class="flex-1">
                    <input
                        v-model="role"
                        type="radio"
                        name="roles"
                        value="student"
                        id="student"
                        class="hidden peer"
                    />
                    <label
                        for="student"
                        class="cursor-pointer px-4 py-3 peer-checked:bg-ci-secondary-2 peer-checked:text-text-100 font-semibold flex items-center justify-center gap-2"
                    >
                        <HugeiconsIcon
                            :icon="icons.StudentIcon"
                            color="currentColor"
                            :size="24"
                            :stroke-width="1.5"
                        />
                        Student
                    </label>
                </div>

                <div class="flex-1">
                    <input
                        v-model="role"
                        type="radio"
                        name="roles"
                        value="instructor"
                        id="instructor"
                        class="hidden peer"
                    />
                    <label
                        for="instructor"
                        class="cursor-pointer px-4 py-3 peer-checked:bg-ci-secondary-2 peer-checked:text-text-100 font-semibold flex items-center justify-center gap-2"
                    >
                        <HugeiconsIcon
                            :icon="icons.TeacherIcon"
                            color="currentColor"
                            :size="24"
                            :stroke-width="1.5"
                        />
                        Instructor
                    </label>
                </div>
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-2 w-full">
                <label>Enter Password*</label>
                <inputtext
                    v-model="password"
                    input_type="password"
                    input_placeholder="Enter Password"
                />
                <ul class="text-text-500 text-xs">
                    <li>Must have at least 8-20 characters</li>
                </ul>

                <label>Confirm Password*</label>
                <inputtext
                    v-model="confirmPassword"
                    input_type="password"
                    input_placeholder="Confirm Password"
                />
            </div>

            <div v-if="formError" class="text-error text-sm text-center">
                {{ formError }}
            </div>

            <!-- Button -->
            <Button
                type="submit"
                :disabled="isLoading"
                class="w-full items-center justify-center flex"
            >
                {{ isLoading ? 'Creating Account...' : 'Create Account' }}
            </Button>
        </form>

        <p class="mt-4 text-center text-text-300 flex gap-3">
            Already Have an Account?
            <a @click="goLogin" class="underline cursor-pointer font-bold text-text-100">
                Log In
            </a>
        </p>
    </main>
</template>