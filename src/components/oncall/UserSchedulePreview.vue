<template>
  <div
    class="grid relative"
    :class="this.range == 'day' ? 'grid-cols-24' : (this.range == 'week' ? 'grid-cols-7' : 'grid-cols-4')"
  >
    <div
      v-for="(instant, index) in generateTicks()"
      :key="index"
      class="h-9"
      :class="isUserOnSchedule(instant) ? this.color : ''"
    ></div>
    <div class="absolute w-full leading-9 text-center text-lg text-gray-700 font-bold"> {{ user.full_name }}</div>
  </div>
</template>

<script>
import {
  differenceInCalendarDays,
  startOfDay, endOfDay, eachHourOfInterval,
  startOfWeek, endOfWeek, eachDayOfInterval,
  startOfMonth, endOfMonth, eachWeekOfInterval,
} from 'date-fns'

export default {
  props: ['user', 'layer', 'currentDate', 'range'],
  methods: {
    generateTicks() {
      if(this.range == 'month') {
        return eachWeekOfInterval({
          start: startOfMonth(this.currentDate),
          end: endOfMonth(this.currentDate),
        }).slice(0, 4)
      }

      if (this.range == 'week') {
        return eachDayOfInterval({
          start: startOfWeek(this.currentDate),
          end: endOfWeek(this.currentDate),
        })
      }

      if (this.range == 'day') {
        return eachHourOfInterval({
          start: startOfDay(this.currentDate),
          end: endOfDay(this.currentDate),
        })
      }
    },
    isUserOnSchedule(instant) {
      if (instant < this.layer.start) {
        return false
      }

      const daysSinceRotationStart = differenceInCalendarDays(instant, this.layer.start)
      const currentRotation = Math.floor(daysSinceRotationStart / this.daysOfRotation)
      return (currentRotation % this.numOnCallUsers) == this.positionInOnCallUsers
    }
  },
  computed: {
    positionInOnCallUsers() {
      return this.layer.users.indexOf(this.user)
    },
    numOnCallUsers() {
      return this.layer.users.length
    },
    daysOfRotation() {
      return this.layer.rotation == 'weekly' ? 7 : 1
    },
    color() {
      const palette = ['bg-blue-400', 'bg-green-400', 'bg-sky-300',]
      return palette[this.positionInOnCallUsers % palette.length]
    }
  }
}
</script>
