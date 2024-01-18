<template>
    <v-navigation-drawer :modelValue="true" permanent :rail="drawer" color="primary" class="navigation">
        <v-img v-if="!drawer" width="60%" src="@/assets/pics/wideNavLogo.png" class="mx-auto mt-8 mb-4" />
        <v-img v-if="drawer" width="50%" src="@/assets/pics/navLogo.png" class="mx-auto mt-5" />
        <v-list :items="items" item-value="value" item-children="items" class="list-item" active-color="white" base-color="lighBlue" />
    </v-navigation-drawer>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        drawer: Boolean,
    },
    data() {
        return {};
    },
    computed: {
        items() {
            return [
                {
                    title: this.$t("Dashboard"),
                    value: "Dashboard",
                    items: [{
                        title: this.$t("Analytics"), value: "Analytics", props: {
                            prependIcon: "mdi-square-medium"
                        }
                    },
                    {
                        title: this.$t("CRM"), value: "CRM", props: {
                            prependIcon: "mdi-square-medium"
                        }
                    }],
                    props: {
                        prependIcon: "mdi-view-dashboard",
                    }
                }, {
                    title: this.$t("users"),
                    value: "Users",
                    props: {
                        prependIcon: "mdi-account-multiple-check",
                        to: { name: "users"}
                    },
                },
                {
                    title: this.$t("Authentication"),
                    value: "Authentication",
                    props: {
                        prependIcon: "mdi-account-circle"
                    }
                }
            ];
        }
    }
});
</script>
<style lang="scss">
.navigation {

    .list-item {
        .v-list-item__prepend>.v-icon~.v-list-item__spacer {
            width: 8px;
        }
        .v-list-group {
            --list-indent-size: 0px;
        }
        >.v-list-group>.v-list-group__items {
            --indent-padding: 0px;
        }
        .v-list-item__overlay,
        .v-ripple__container {
            display: none;
        }
    }
}
</style>