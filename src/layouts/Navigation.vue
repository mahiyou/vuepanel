<template>
    <v-navigation-drawer :modelValue="true" permanent :rail="drawer" color="primary" class="navigation">
        <v-img v-if="!drawer" width="60%" src="@/assets/pics/wideNavLogo.png" class="mx-auto mt-8 mb-4" />
        <v-img v-if="drawer" width="50%" src="@/assets/pics/navLogo.png" class="mx-auto mt-5" />
        <v-list :items="items" item-value="value" item-children="items" item-title="title" class="list-item"
            active-color="white" base-color="lighBlue">
        </v-list>

    </v-navigation-drawer>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        drawer: Boolean,
    },
    data() {
        return {
            items: [
                {
                    title: "داشبورد",
                    value: "Dashboard",
                    items: [{
                        title: "22داشبورد",
                        value: "Dashboard22", icon: "mdi-account-circle-outline",
                        items: [{
                            title: "آنالیزها", value: "Analytics", props: {
                                prependIcon: "mdi-circle-medium"
                            }
                        }, {
                            title: "آنالیزها", value: "Analytics2", props: {
                                prependIcon: "mdi-circle-medium",
                            }
                        }],
                        props: {
                            prependIcon: "mdi-menu-left"
                        }
                    },
                    {
                        title: "سی آر ام", value: "CRM", props: {
                            prependIcon: "mdi-menu-left"
                        }
                    }],
                    props: {
                        prependIcon: "mdi-view-dashboard-outline"
                    }
                },
                {
                    title: "احراز هویت",
                    value: "Authentication",
                    items: [{
                        title: "آنالیزها", value: "Analytics3", props: {
                            prependIcon: "mdi-menu-left"
                        }
                    }, {
                        title: "سی آر ام", value: "CRM2", props: {
                            prependIcon: "mdi-menu-left"
                        }
                    }],
                    props: {
                        prependIcon: "mdi-account-circle-outline"
                    }
                }
            ],
        };
    }
});
</script>
<style lang="scss">
.navigation {
    .list-item {

        .v-list-item__prepend {
            width: 25px;
        }

        .v-list-item__overlay,
        .v-ripple__container {
            display: none;
        }
    }
}
</style>