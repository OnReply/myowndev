<template>
  <div class="h-full">
    <iframe :src="tickets_url" height="100%" width="100%" frameborder="0" />
  </div>
</template>

<script>
import md5 from 'md5';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      currentAccountId: 'getCurrentAccountId',
      currentUserID: 'getCurrentUserID',
    }),
    tickets_url() {
      let url =
        window.chatwootConfig.ticketsUrl + 
        "account_id=" +
        md5(
          this.currentAccountId.toString() + window.chatwootConfig.randomString
        ) + 
        '&agent_id=' + 
        md5(
          this.currentUserID.toString() + window.chatwootConfig.randomString
        );
      return url;
    },
  },
};
</script>

<style scoped>
.h-full {
  height: 100%;
}
</style>
