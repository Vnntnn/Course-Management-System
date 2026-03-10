<script setup>
import Contentcontainer from '@/assets/contentcontainer.vue'
import ExamQuestion from '@/components/examquestion.vue'
import Button from '@/assets/button.vue'
import { go, goBack } from '@/utils/navigation'
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons'
</script>

<template>

<main class="mt-24 mx-5 space-y-6">

<Button
variant="primary_border"
@click="goBack()"
>
Back to Exam
</Button>

<div class="flex justify-between items-center">

<h1 class="text-4xl font-bold">
Question List
</h1>

<Button
class="flex gap-2"
@click="go('/createquestion')"
>

<HugeiconsIcon :icon="icons.Add01Icon"/>

Create Question

</Button>

</div>

<Contentcontainer class="space-y-4">

<ExamQuestion
number="1"
question="What is Vue?"
>
<label><input type="radio" name="q1"> A JavaScript Framework</label>
<label><input type="radio" name="q1"> A CSS Library</label>
</ExamQuestion>

<ExamQuestion
number="2"
question="What is Composition API?"
>
<label><input type="radio" name="q2"> Vue Feature</label>
<label><input type="radio" name="q2"> React Feature</label>
</ExamQuestion>

</Contentcontainer>

</main>

</template>