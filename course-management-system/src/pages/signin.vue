<script setup>
import { HugeiconsIcon } from '@hugeicons/vue';
import * as icons from '@hugeicons/core-free-icons/index'
import Button from '@/assets/button.vue';
import inputtext from '@/assets/inputtext.vue';

import { useRouter } from 'vue-router';

const router = useRouter();

function goLogin(){
    router.push('/login');
}
</script>

<template>
    <form action="" class="flex items-center justify-center flex-col">
        <legend class="font-bold">Sign In</legend>
        <div>
            <inputtext input_type="text" input_placeholder="First Name"/>
            <inputtext input_type="text" input_placeholder="Last Name"/>
        </div>

        <inputtext input_type="email" input_placeholder="Email" />

        <div class="border rounded p-0 inline-flex overflow-hidden">

            <div>
                <input type="radio" name="roles" id="student" class="hidden peer" />
                <label for="student"  class="cursor-pointer px-4 py-2 peer-checked:bg-ci-secondary-2 peer-checked:text-text-100 font-semibold flex gap-2">
                    <HugeiconsIcon :icon="icons.StudentIcon" color="currentColor" :size="24" :stroke-width="1.5"/>
                    Student
                </label>
            </div>

            <div>
                <input type="radio" name="roles" id="instructor" class="hidden peer" />
                <label for="instructor" class="cursor-pointer px-4 py-2 peer-checked:bg-ci-secondary-2 peer-checked:text-text-100 font-semibold flex gap-2">
                    <HugeiconsIcon :icon="icons.TeacherIcon" color="currentColor" :size="24" :stroke-width="1.5"/>
                    Instructor
                </label>
            </div>
        </div>

        <inputtext input_type="password" input_placeholder="Enter Password"/>
        <inputtext input_type="password" input_placeholder="Confirm Password"/>

        <Button type="button">Create Account</Button>

        <p>Already Have an Account? <a @click="goLogin" class="underline">Log In</a></p>
    </form>
</template>