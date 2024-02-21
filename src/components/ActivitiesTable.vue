<template>
    <v-table class="activities-table">
        <tbody>
            <tr>
                <td></td>
                <td class="pb-1" v-for="(span, month) in months" :colspan="span">{{ month }}</td>
            </tr>
            <tr v-for="d in daysOfWeek">
                <td class="pe-2">{{ getNameOfDay(d) }}</td>
                <template v-for="w in weeks.length">
                    <v-tooltip
                        :text="weeks[w - 1][d] ? (days?.[weeks[w - 1][d]] + ' ' + $t('user.activities.number.per-day') + ' ' + weeks[w - 1][d]) : ''"
                        location="top">
                        <template v-slot:activator="{ props }">
                            <td v-bind="props" :class="getBackground(days?.[weeks[w - 1][d]])" />
                        </template>
                    </v-tooltip>
                </template>
            </tr>
        </tbody>
    </v-table>
</template>
<script lang="ts">
import { PropType, defineComponent } from 'vue';

export default defineComponent({
    props: {
        activitiesPerDate: {
            required: true,
            type: Object as PropType<Record<string, number>>
        },
        firstDayOfWeek: {
            required: false,
            default: 0,
            type: Number,
        },
    },
    methods: {
        getBackground(index: number | undefined) {
            if (index === undefined) {
                return '';
            }
            if (index < 20) {
                return 'bg-primary-lighten-4';
            }
            if (index < 40) {
                return 'bg-primary-lighten-3';
            }
            if (index < 60) {
                return 'bg-primary-lighten-2';
            }
            if (index < 80) {
                return 'bg-primary-lighten-1';
            }

            return 'bg-primary';
        },
        getNameOfDay(day: number): string {
            if (this.firstDayOfWeek == 0) {
                if (day == 1 || day == 3 || day == 5) {
                    return this.getTitleOfDay(day);
                }
            } else {
                if (day == 0 || day == 2 || day == 4 || day == 5) {
                    return this.getTitleOfDay(day);
                }
            }
            return "";
        },
        getTitleOfDay(day: number) {
            if (day == 0) {
                return 'Sun';
            }
            if (day == 1) {
                return 'Mon';
            }
            if (day == 2) {
                return 'Tue';
            }
            if (day == 3) {
                return 'Wen';
            }
            if (day == 4) {
                return 'Thu';
            }
            if (day == 5) {
                return 'Fri';
            }
            return 'Sat';
        },
        formatedDate(date: Date) {
            const year = date.getFullYear();
            let month = "";
            let day = "";
            if ((date.getMonth() + 1).toString().length === 1) {
                month = "0" + (date.getMonth() + 1)
            } else {
                month = ((date.getMonth()) + 1).toString();
            }
            if ((date.getDate()).toString().length === 1) {
                day = "0" + (date.getDate())
            } else {
                day = ((date.getDate())).toString();
            }
            return year + "-" + month + "-" + day
        }
    },
    computed: {
        daysOfWeek(): number[] {
            const result = [];
            for (let d = this.firstDayOfWeek, i = 0; i < 7; d = (d + 1) % 7, i++) {
                result.push(d);
            }
            return result;
        },
        days(): Record<string, number> {
            const a = new Date();
            a.setHours(0, 0, 0, 0);
            const today = a.getTime();
            const days = {} as Record<string, number>
            for (let i = 364; i >= 0; i--) {
                const time = today - 86400000 * i;
                const date = this.formatedDate(new Date(time));
                days[date] = this.activitiesPerDate[date] || 0;
            }
            return days;
        },
        weeks(): string[][] {
            const days = this.days;
            const dates = Object.keys(days).sort();
            const weeks: string[][] = [];
            for (let i = 0; i < 53; i++) {
                weeks.push([])
            }

            for (let i = 0, week = 0; i < dates.length; i++) {
                const date = new Date(dates[i]);
                const day = date.getDay();

                weeks[week][day] = dates[i]
                if (day == (this.firstDayOfWeek === 0 ? 6 : this.firstDayOfWeek - 1)) {
                    week++;
                }
            }

            return weeks;
        },
        months(): Record<string, number> {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
            const result: Record<string, number> = {};

            for (const week of this.weeks) {
                let name: string | undefined;
                for (let d = this.firstDayOfWeek, i = 0; i < 7 && !name; i++, d = (d + 1) % 7) {
                    if (week[d] !== undefined) {
                        const date = new Date(week[d]);
                        name = monthNames[date.getMonth()];
                    }
                }
                if (name === undefined) {
                    throw new Error("week cant't be empty");
                }
                if (result[name] === undefined) {
                    result[name] = 1;
                } else {
                    result[name]++
                }
            }
            return result;
        }
    }
})
</script>