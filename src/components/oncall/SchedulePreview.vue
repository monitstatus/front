<template>
  <div class="flex flex-col md:flex-row">
    <div class="inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        @click="range = 'day'"
        :class="[range === 'day' ? 'text-blue-400 border-blue-400' : 'text-gray-900 border-gray-200']"
        class="py-1 px-3 text-sm font-medium rounded-l-md border bg-white w-24"
      >
        Day
      </button>
      <button
        type="button"
        @click="range = 'week'"
        :class="[range === 'week' ? 'text-blue-400 border-blue-400' : 'text-gray-900 border-gray-200']"
        class="py-1 px-3 text-sm font-medium border bg-white w-24"
      >
        Week
      </button>
      <button
        type="button"
        @click="range = 'month'"
        :class="[range === 'month' ? 'text-blue-400 border-blue-400' : 'text-gray-900 border-gray-200']"
        class="py-1 px-3 text-sm font-medium rounded-r-md border bg-white w-24"
      >
        Month
      </button>
    </div>
    <div class="flex grow space-x-3 items-center text-lg text-gray-900">
      <div class="grow"></div>
      <div @click="previousCurrentDate()" class="cursor-pointer">
        <ChevronLeftIcon class="w-5 h-5" />
      </div>
      <div class="w-64 text-center">{{ showingDateRange }}</div>
      <div @click="nextCurrentDate()" class="cursor-pointer">
        <ChevronRightIcon class="w-5 h-5" />
      </div>
    </div>
  </div>
  <div class="border mt-3">
    <div class="grid" :class="range == 'week' ? 'grid-cols-7' : (range == 'day' ? 'grid-cols-24' : 'grid-cols-4')">
      <div v-for="value in tickDates" class="border-2" :key="value">{{ value }}</div>
      <div></div>
    </div>
    <div v-for="(layer, index) in layers" :key="index">
      <div class="bg-slate-50" :class="layer.users.length == 0 ? 'h-10':'h-full'">
        <div v-for="(user, index) in layer.users" :key="index" class="py-1 opacity-80">
          <UserSchedulePreview
            :user="user"
            :layer="layer"
            :currentDate="currentDate"
            :range="range"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import {
  format,
  startOfMonth, endOfMonth, eachWeekOfInterval,
  startOfWeek, endOfWeek, eachDayOfInterval,
  startOfDay, endOfDay, eachHourOfInterval,
} from 'date-fns'

import UserSchedulePreview from './UserSchedulePreview.vue'

export default {
  props: {
    layers: { type: Array },
  },
  components: { ChevronLeftIcon, ChevronRightIcon, UserSchedulePreview },
  data() {
    return {
      range: 'week',
      currentDate: new Date(),
    }
  },
  computed: {
    tickDates() {
      if(this.range == 'month') {
        return eachWeekOfInterval({
          start: startOfMonth(this.currentDate),
          end: endOfMonth(this.currentDate),
        }).map(day => format(day, 'dd LLLL')).slice(0, 4)
      }

      if(this.range == 'week') {
        return eachDayOfInterval({
          start: startOfWeek(this.currentDate),
          end: endOfWeek(this.currentDate)
        }).map(day => format(day, 'dd E'))
      }

      if(this.range == 'day') {
        return eachHourOfInterval({
          start: startOfDay(this.currentDate),
          end: endOfDay(this.currentDate)
        }).map(hour => format(hour, 'h a'))
      }
    },
    showingDateRange() {
      const dayFormat = 'MMMM d'

      if(this.range == 'month') {
        return format(this.currentDate, 'MMMM')
      }

      if(this.range == 'week') {
        return format(startOfWeek(this.currentDate), dayFormat) + ' - ' + format(endOfWeek(this.currentDate), dayFormat)
      }

      if(this.range == 'day') {
        return format(this.currentDate, dayFormat)
      }
    },
    startDate() {
      if (this.range == 'day') {
        return startOfDay(this.currentDate)
      }
      if (this.range == 'week') {
        return startOfWeek(this.currentDate)
      }
      return startOfMonth(this.currentDate)
    },
    endDate() {
      let date = new Date(this.currentDate)
      if (this.range == 'month') {
        date.setMonth(date.getMonth() + 1)
        return startOfMonth(date)
      } else {
        const daysAgo = this.range == 'week' ? 7 : 1
        date.setDate(date.getDate() + daysAgo)

        if (this.range == 'week') {
          return startOfWeek(date)
        }
        return startOfDay(date)
      }
    },
    userOnCallEvents() {
      return `Should generate time events for the users in the layers between ${this.startDate} and ${this.endDate}`
    }
  },
  methods: {
    nextCurrentDate() {
      let date = new Date(this.currentDate)

      if (this.range == 'month') {
        date.setMonth(date.getMonth() + 1)
      } else {
        const daysAgo = this.range == 'week' ? 7 : 1
        date.setDate(date.getDate() + daysAgo)
      }

      this.currentDate = date
    },
    previousCurrentDate() {
      const date = new Date(this.currentDate)

      if (this.range == 'month') {
        date.setMonth(date.getMonth() - 1)
      } else {
        const daysAgo = this.range == 'week' ? 7 : 1
        date.setDate(date.getDate() - daysAgo)
      }

      this.currentDate = date
    }
  }
}
</script>

<style scoped>
.emptyScheduleBackground {
background: repeating-linear-gradient(
  -45deg,
  rgb(226 232 240),
  rgb(226 232 240) 10px,
  rgb(203 213 225) 10px,
  rgb(203 213 225) 20px
);
}

</style>