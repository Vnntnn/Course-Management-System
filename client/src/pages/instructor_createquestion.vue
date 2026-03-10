<script setup>
import { ref } from 'vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import Button from '@/assets/button.vue'
import Inputtext from '@/assets/inputtext.vue'
import Radioinput from '@/assets/radioinput.vue'
import { goBack } from '@/utils/navigation'

const choices = ref([
  { id: 1, text: '' }
])

function addChoice() {
  choices.value.push({
    id: choices.value.length + 1,
    text: ''
  })
}

function removeChoice(index) {
  choices.value.splice(index, 1)
}
</script>

<template>

<main class="mt-24 mx-5">
<Button @click="goBack()" variant="primary_border">Go Back</Button>

<Contentcontainer>

<form class="flex flex-col gap-4">

<label class="font-semibold">
Question
</label>

<Inputtext
input_placeholder="ใส่คำถามเช่น สิ่งนี้คืออะไร"
/>

<Button
type="button"
variant="primary_border"
@click="addChoice"
>
Add Choice
</Button>

<div class="flex flex-col gap-3">

<div
v-for="(choice, index) in choices"
:key="choice.id"
class="flex items-center gap-3"
>

<Radioinput
name="correct"
/>

<Inputtext
input_placeholder="Choice text"
/>

<Button
type="button"
variant="danger"
@click="removeChoice(index)"
>
Remove
</Button>

</div>

</div>

<Button type="submit">
Create Question
</Button>

</form>

</Contentcontainer>

</main>

</template>