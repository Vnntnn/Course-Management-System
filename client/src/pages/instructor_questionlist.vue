<script setup>
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import { go, goBack } from '@/utils/navigation'
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons/index'
</script>

<template>

<main class="mt-24 mx-5">

<Button variant="primary_border" @click="goBack()">
Back to Exam
</Button>

<div class="flex justify-between items-center p-5">

<h1 class="text-4xl font-bold">
Question List
</h1>

<Button
class="flex gap-2"
@click="go('/questioncreate')"><HugeiconsIcon :icon="icons.Add01Icon"/>Create</Button>

</div>

<Contentcontainer class="space-y-4">

<!-- Question cards -->
<div class="p-4 rounded-xl bg-ci-secondary-1">
Question 1
</div>

<div class="p-4 rounded-xl bg-ci-secondary-1">
Question 2
</div>

</Contentcontainer>

</main>

</template>