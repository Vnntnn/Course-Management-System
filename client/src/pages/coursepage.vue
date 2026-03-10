<script setup>
import { HugeiconsIcon } from '@hugeicons/vue';
import * as icons from '@hugeicons/core-free-icons/index'
import Button from '@/assets/button.vue';
import { go } from '@/utils/navigation';
import { goBack } from '@/utils/navigation';
import Contentcontainer from '@/assets/contentcontainer.vue';
</script>

<template>
    <main class="mt-24 px-5">
        <nav class="flex justify-between">
            <Button @click="goBack()" variant="primary_border">Go Back</Button>

            <div class="flex gap-2">
                <Button class="flex gap-2"> <!-- Haven't enrolled yet -->
                    <HugeiconsIcon :icon="icons.Book02Icon"/>
                    Enroll
                </Button>
                <Button class="flex gap-2" @click="go('/chapterlist')"> <!-- Have Enrolled -->
                    <HugeiconsIcon :icon="icons.Book02Icon"/>
                    Chapter
                </Button>
                <Button class="flex gap-2" @click="go('/examlist')"> <!-- Have Enrolled -->
                    <HugeiconsIcon :icon="icons.Book02Icon"/>
                    Exam
                </Button>
            </div>
        </nav>

        <Contentcontainer>
            <h1>Course Name</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis doloremque facere fugit ullam quibusdam reprehenderit, molestias suscipit impedit enim consectetur vitae voluptate est consequatur quam, quidem praesentium minima sapiente porro?</p>
        </Contentcontainer>
    </main>
</template>