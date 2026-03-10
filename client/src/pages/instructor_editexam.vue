<script setup>
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Inputtext from '@/assets/inputtext.vue'
import { go, goBack } from '@/utils/navigation'
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons/index'
</script>

<template>

<main class="mt-24 mx-5 space-y-6">

<Button
variant="primary_border"
@click="goBack()"
>
Back to Exam List
</Button>

<h1 class="text-4xl font-bold">
Manage Exam
</h1>

<Contentcontainer class="space-y-4">

<label class="font-semibold">
Exam Name
</label>

<Inputtext input_placeholder="Enter exam name"/>

</Contentcontainer>

<div class="flex justify-between items-center">

<h2 class="text-3xl font-bold">
Questions
</h2>

<Button
class="flex gap-2"
@click="go('/questioncreate')"
>

<HugeiconsIcon :icon="icons.Add01Icon"/>

Create

</Button>

</div>

<Contentcontainer class="space-y-4">

<div class="p-4 rounded-xl bg-ci-secondary-1 flex justify-between items-center">

<div>
Question 1
</div>

<Button
variant="primary_border"
@click="go('/questionedit')"
>
Edit
</Button>

</div>

<div class="p-4 rounded-xl bg-ci-secondary-1 flex justify-between items-center">

<div>
Question 2
</div>

<Button
variant="primary_border"
@click="go('/questionedit')"
>
Edit
</Button>

</div>

</Contentcontainer>

</main>

</template>