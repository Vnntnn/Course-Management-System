<script setup>
import { HugeiconsIcon } from "@hugeicons/vue";
import * as icons from "@hugeicons/core-free-icons";
import Button from '@/assets/button.vue'
import { go } from '@/utils/navigation'
import Inputtext from "@/assets/inputtext.vue";
import Contentcontainer from "@/assets/contentcontainer.vue";
import course from "@/components/course.vue";

</script>

<template>
    <main class="mt-24">
        <h1 class="font-bold text-2xl mx-5">Browse Course</h1>
        <Contentcontainer class="mx-5 space-y-4">
            <div class="flex items-center gap-4">
                <Inputtext input_type="text" input_placeholder="search"/>
                <Button variant="primary_border" size="small_squared" class="flex gap-2"><HugeiconsIcon :icon="icons.Search02Icon"/>Search</Button>
            </div>
            <div id="courselist" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <course coursename="Blender 3D Crash course" coursedesc="Learn Blender 3D from Scratch from Modeling, texturing, and Rendering"/>
                <course/>
                <course/>
            </div>
        </Contentcontainer>
    </main>
</template>