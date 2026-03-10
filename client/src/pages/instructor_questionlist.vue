<script setup>
import { ref, onMounted } from 'vue'
import Button from '@/assets/button.vue'
import Contentcontainer from '@/assets/contentcontainer.vue'
import { go, goBack } from '@/utils/navigation'
import { HugeiconsIcon } from '@hugeicons/vue'
import * as icons from '@hugeicons/core-free-icons/index'
import { examAPI } from '@/utils/api'

const params = new URLSearchParams(window.location.search)
const examId = params.get('examId')

const exam = ref(null)
const questions = ref([])
const isLoading = ref(false)
const error = ref('')

const fetchExam = async () => {
  if (!examId) return
  isLoading.value = true
  try {
    const res = await examAPI.getById(examId)
    exam.value = res.data
    questions.value = res.data?.questions || []
  } catch (err) {
    error.value = err.message || 'Failed to load questions'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchExam)
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
@click="go(`/questioncreate?examId=${examId}`)"
><HugeiconsIcon :icon="icons.Add01Icon"/>Create</Button>

</div>

<div v-if="isLoading" class="text-text-400 text-center py-8">Loading questions...</div>
<div v-if="error" class="text-red-500 text-center py-4">{{ error }}</div>

<Contentcontainer v-if="questions.length === 0 && !isLoading" class="text-center py-8 text-text-400">
  No questions yet. Click "Create" to add some.
</Contentcontainer>

<Contentcontainer v-else class="space-y-4">

<div
  v-for="(q, index) in questions"
  :key="q.id"
  class="p-4 rounded-xl bg-ci-secondary-1"
>
  <p class="font-semibold">{{ index + 1 }}. {{ q.question_text }}</p>
  <div class="grid grid-cols-2 gap-2 mt-2 text-sm">
    <div :class="['p-2 rounded', q.correct_option === 'A' ? 'bg-green-500/20 font-bold' : '']">A) {{ q.option_a }}</div>
    <div :class="['p-2 rounded', q.correct_option === 'B' ? 'bg-green-500/20 font-bold' : '']">B) {{ q.option_b }}</div>
    <div :class="['p-2 rounded', q.correct_option === 'C' ? 'bg-green-500/20 font-bold' : '']">C) {{ q.option_c }}</div>
    <div :class="['p-2 rounded', q.correct_option === 'D' ? 'bg-green-500/20 font-bold' : '']">D) {{ q.option_d }}</div>
  </div>
</div>

</Contentcontainer>

</main>

</template>