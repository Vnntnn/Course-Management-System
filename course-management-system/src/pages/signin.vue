<script setup>
import { HugeiconsIcon } from '@hugeicons/vue';
import * as icons from '@hugeicons/core-free-icons/index'
import Button from '@/assets/button.vue';
import inputtext from '@/assets/inputtext.vue';
import { go } from '@/utils/navigation';
import Header from '@/components/header.vue';
</script>

<template>
    <Header/>

    <main class="flex items-center justify-center min-h-screen flex-col">

    <form class="flex flex-col p-8 gap-5 w-96">

    <legend class="font-bold text-3xl text-center">
        Create Account
    </legend>

    <!-- User Info -->
    <div class="flex flex-col gap-2 w-full">

        <label for="firstname">First Name*</label>
        <inputtext
            id="firstname"
            input_type="text"
            input_placeholder="First Name"
        />

        <label for="lastname">Last Name*</label>
        <inputtext
            id="lastname"
            input_type="text"
            input_placeholder="Last Name"
        />

        <label for="email">Email*</label>
        <inputtext
            id="email"
            input_type="email"
            input_placeholder="example@gmail.com"
        />

    </div>


    <!-- Role Selector -->
    <div class="w-full border rounded-lg inline-flex overflow-hidden">

        <div class="flex-1">
            <input type="radio" name="roles" id="student" class="hidden peer"/>

            <label for="student" class="cursor-pointer px-4 py-3 peer-checked:bg-ci-secondary-2 peer-checked:text-text-100 font-semibold flex items-center justify-center gap-2">
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
                type="radio"
                name="roles"
                id="instructor"
                class="hidden peer"
            />

            <label for="instructor"  class="cursor-pointer px-4 py-3 peer-checked:bg-ci-secondary-2 peer-checked:text-text-100 font-semibold flex items-center justify-center gap-2">
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
        <inputtext input_type="password" input_placeholder="Enter Password"/>

        <label>Confirm Password*</label>
        <inputtext input_type="password" input_placeholder="Confirm Password"/>

    </div>


    <!-- Button -->
    <Button type="button" class="w-full">Create Account</Button>

    </form>


    <p class="mt-4 text-center">
        Already Have an Account?
        <a @click="go('/login')"  class="underline cursor-pointer">Log In</a>
    </p>

</main>
</template>