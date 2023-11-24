<template>
  <div class="relative flex">
    <woot-button
      v-tooltip.right="$t('CHAT_LIST.SORT_TOOLTIP_LABEL')"
      variant="smooth"
      size="tiny"
      color-scheme="secondary"
      class="selector-button"
      icon="sort-icon"
      @click="toggleDropdown"
    />
    <div
      v-if="showActionsDropdown"
      v-on-clickaway="closeDropdown"
      class="dropdown-pane dropdown-pane--open basic-filter"
      :class="direction"
    >
      <div class="items-center flex justify-between last:mt-4">
        <span class="text-slate-800 dark:text-slate-100 text-xs font-medium">{{
          $t('CHAT_LIST.CHAT_SORT.STATUS')
        }}</span>
        <filter-item
          type="status"
          :selected-value="chatStatus"
          :items="chatStatusItems"
          path-prefix="CHAT_LIST.CHAT_STATUS_FILTER_ITEMS"
          @onChangeFilter="onChangeFilter"
        />
      </div>
      <div class="items-center flex justify-between last:mt-4">
        <span class="text-slate-800 dark:text-slate-100 text-xs font-medium">{{
          $t('CHAT_LIST.CHAT_SORT.ORDER_BY')
        }}</span>
        <filter-item
          type="sort"
          :selected-value="sortFilter"
          :items="chatSortItems"
          path-prefix="CHAT_LIST.CHAT_SORT_FILTER_ITEMS"
          @onChangeFilter="onChangeFilter"
        />
      </div>
    </div>
  </div>
</template>

<script>
import wootConstants from 'dashboard/constants/globals';
import { mapGetters } from 'vuex';
import { mixin as clickaway } from 'vue-clickaway';
import FilterItem from './FilterItem.vue';
import uiSettingsMixin from 'dashboard/mixins/uiSettings';

export default {
  components: {
    FilterItem,
  },
  mixins: [clickaway, uiSettingsMixin],
  data() {
    return {
      showActionsDropdown: false,
      chatStatusItems: this.$t('CHAT_LIST.CHAT_STATUS_FILTER_ITEMS'),
      chatSortItems: this.$t('CHAT_LIST.CHAT_SORT_FILTER_ITEMS'),
      direction: "ltr"
    };
  },
  computed: {
    ...mapGetters({
      chatStatusFilter: 'getChatStatusFilter',
      chatSortFilter: 'getChatSortFilter',
      getAccount: 'accounts/getAccount',
      currentAccountId: 'getCurrentAccountId',
    }),
    chatStatus() {
      return this.chatStatusFilter || wootConstants.STATUS_TYPE.OPEN;
    },
    sortFilter() {
      return this.chatSortFilter || wootConstants.SORT_BY_TYPE.LATEST;
    },
  },
  methods: {
    onTabChange(value) {
      this.$emit('changeFilter', value);
      this.closeDropdown();
    },
    toggleDropdown() {
      this.direction = new Intl.Locale(this.getAccount(this.currentAccountId).locale).textInfo.direction
      this.showActionsDropdown = !this.showActionsDropdown;
    },
    closeDropdown() {
      this.showActionsDropdown = false;
    },
    onChangeFilter(value, type) {
      this.$emit('changeFilter', value, type);
      this.saveSelectedFilter(type, value);
    },
    saveSelectedFilter(type, value) {
      this.updateUISettings({
        conversations_filter_by: {
          status: type === 'status' ? value : this.chatStatus,
          order_by: type === 'sort' ? value : this.sortFilter,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.basic-filter {
  @apply w-52 p-4 top-6;
}
.ltr {
  right: 0;
}

.rtl {
  left: 0;
}
</style>
