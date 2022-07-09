<template>
        <div class="mt-15">
            <div class="container shadow p-3 mb-5 bg-white">
                <div class="row">
                    <h1><v-icon size="50" color="info">mdi-account-supervisor-outline</v-icon>Staff Management</h1>
                    <user-table/>
                </div>
            </div>

        </div>
</template>
<script>
import UserTable from './UserTable.vue'
export default {
    components:{UserTable},
    created() {
        this.$store.dispatch("getUserList")
    }
}
</script>
