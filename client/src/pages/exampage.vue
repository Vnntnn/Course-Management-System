<script setup>
import Examquestion from '@/components/examquestion.vue';
import Radioinput from '@/assets/radioinput.vue';
import Button from '@/assets/button.vue';
import { ref } from 'vue';
import { go } from '@/utils/navigation';

const selected = ref('');
</script>

<template>
    <main class="mt-24 mx-5 space-y-5">
        <Examquestion number="1" question="ทำไมไม่ถอนวิชานี้ครับพี่ชาย">
            <Radioinput name="reason" value="unknown" label="ไม่รู้ครับ" checked="true"/>
            <Radioinput name="reason" value="late" label="ถอนไม่ทันครับ" checked="false"/>
            <Radioinput name="reason" value="fight" label="ผมสู้ครับ" checked="false"/>
            <Radioinput name="reason" value="hold" label="อยากถอนแต่เขารั้งไว้ครับ" checked="false"/>
            <Radioinput name="reason" value="private" label="เรื่องของผมครับ" checked="false"/>
        </Examquestion>
        <Examquestion number="2" question="อะไรนะขออีกที">
            <Radioinput name="reason" value="unknown" label="ไม่รู้ครับ" checked="true"/>
            <Radioinput name="reason" value="late" label="ถอนไม่ทันครับ" checked="false"/>
            <Radioinput name="reason" value="fight" label="ผมสู้ครับ" checked="false"/>
            <Radioinput name="reason" value="hold" label="อยากถอนแต่เขารั้งไว้ครับ" checked="false"/>
            <Radioinput name="reason" value="private" label="เรื่องของผมครับ" checked="false"/>
        </Examquestion>

        <Button @click="go('/examresult')">Submit</Button>
    </main>
</template>