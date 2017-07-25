<template>
  <div id="app" :class="lunch?'lunch':''" @click="close">
    <h1 v-if="lunch">LUNCH</h1>
    <h1 v-else>{{formattedCountdown}}</h1>
  </div>
</template>

<script>
  import dateFns from "date-fns";
  import { remote } from 'electron';

  export default {
    name: 'lunch-alarm',
    data() {
      return {
        lunchtime: dateFns.addHours(dateFns.startOfToday(), 12),
        countdown: 1
      }
    },
    computed: {
      formattedCountdown() {
        const timer = dateFns.addSeconds(dateFns.startOfToday(), this.countdown);
        return dateFns.format(timer, "ss[s]");
      },
      lunch() {
        return this.countdown === 0;
      }
    },
    methods: {
      close() {
        remote.getCurrentWindow().close();
      }
    },
    mounted() {
      this.interval = setInterval(() => {
        const countdown = Math.max(dateFns.differenceInSeconds(this.lunchtime, new Date()), 0);
        if (countdown != this.countdown) {
          this.countdown = countdown;
        }
      }, 250);
    }
  }

</script>

<style>
  html,
  body {
    padding: 0;
    margin: 0;
  }

  #app {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    background: red;
    user-select: none;
    cursor: default;
  }

  #app.lunch {
    animation-duration: 0.5s;
    animation-name: pulse;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease-in-out;
  }

  h1 {
    font-size: 120px;
  }

  @keyframes pulse {
    from {
      transform: scale(1);
      background-color: hsl(120, 50%, 40%);
    }

    to {
      transform: scale(1.3);
      background-color: hsl(120, 50%, 45%);
    }
  }
</style>