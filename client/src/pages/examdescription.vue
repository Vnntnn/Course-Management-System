<script setup>
<<<<<<< HEAD
=======
import Contentcontainer from '@/assets/contentcontainer.vue';
import Button from '@/assets/button.vue';

const props = defineProps({
    questionamount: {
        Type: String,
        default: '1'
    }
})
>>>>>>> frontend

</script>

<template>
<<<<<<< HEAD
    <main class="mt-24 px-5">
        <h1>Exam Description</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo similique omnis dolorum est amet maxime totam voluptate? Eveniet facere dolorem similique dignissimos repellendus libero, aut, possimus quia neque, accusantium officia.</p>
=======
    <main class="mt-24 mx-5">
        <Contentcontainer class="flex justify-center items-center flex-col">
            <h1 class="text-4xl">Exam Description</h1>
            <p>จำนวนข้อ: {{ questionamount }}</p>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti sunt architecto, eos, commodi earum rerum nesciunt ex, hic illum praesentium voluptatum saepe quod odit? Est autem optio illo sed ex.</p>
            <Button>Start</Button>
        </Contentcontainer>
>>>>>>> frontend
    </main>
</template>