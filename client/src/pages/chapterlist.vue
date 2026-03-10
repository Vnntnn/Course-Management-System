<script setup>
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons'
import Contentcontainer from '@/assets/contentcontainer.vue'
import chapter from '@/components/chapter.vue'
import Button from '@/assets/button.vue'
import { go } from '@/utils/navigation'
import { goBack } from '@/utils/navigation'
</script>

<template>

<main class="mt-24 mx-5">

<Button
variant="primary_border"
@click="goBack()"
>
Back to Course List
</Button>

<div class="flex justify-between items-center p-5">

<h1 class="text-4xl font-bold">
Lessons
</h1>

<Button
class="flex gap-2"
@click="go('/chaptercreate')"
>

<HugeiconsIcon :icon="icons.Add01Icon"/>

Create

</Button>

</div>

<Contentcontainer class="grid grid-cols-4 gap-5">

<chapter/>
<chapter/>
<chapter/>

</Contentcontainer>

</main>

</template>