<script setup>
import { HugeiconsIcon } from '@hugeicons/vue';
import * as icons from '@hugeicons/core-free-icons/index'
import { go } from '@/utils/navigation';
import contentcontainer from '@/assets/contentcontainer.vue';
import { theme } from '@/utils/theme';
import { computed } from 'vue';
import Button from '@/assets/button.vue';
import inputtext from '@/assets/inputtext.vue';

const props = defineProps({
    username : {
        type: String,
        default: 'Mstxz.EXE'
    },
    email : {
        type : String,
        default: 'mstxzexe@gmail.com'
    },
    theme : {
        type : String,
        default : 'dark',
    }
});

const emailClass = computed(() => {
    return theme.value === 'dark' ? 'text-text-400' : 'text-text-500'
})

</script>

<template>
    <main class="space-y-5 mt-24 mx-5">
    <contentcontainer>
        <h1 class="font-bold text-3xl">Welcome! {{ username }}</h1>
        <p :class="emailClass">{{ email }}</p>
    </contentcontainer>

    <section class="space-y-5">
        <h1 class="font-bold text-4xl">My Course</h1>
        <contentcontainer class="h-screen ">
            <div class="flex justify-center space-x-2">
                <inputtext input_type="text" input_placeholder="Search Course"/>
                <Button type="button" size="small_squared" variant="primary_border">
                    <HugeiconsIcon :icon="icons.Search02Icon"/>
                </Button>
            </div>
            <div class="flex justify-center items-center flex-col gap-2 text-text-400 h-full">
                You haven't enrolled into any course yet.
                <Button variant="primary_border" @click="go('/coursebrowser')" class="flex gap-2">
                    <HugeiconsIcon :icon="icons.Search02Icon"/>
                    Browse Course
                </Button>
            </div>
        </contentcontainer>
    </section>
    </main>
</template>