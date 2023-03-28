<template>
  <div class="notifications-link">
    <woot-button
      class-names="notifications-link--button"
      variant="clear"
      color-scheme="secondary"
      :class="{ 'is-active': isNotificationPanelActive }"
      @click="openNotificationPanel"
    >
      <fluent-icon :icon="icon" />
      <span v-if="unreadCount" class="badge warning">{{ unreadCount }}</span>
    </woot-button>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  props: {
    type: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'alert',
    },
  },
  computed: {
    ...mapGetters({
      accountId: 'getCurrentAccountId',
      notificationMetadata: 'notifications/getMeta',
    }),
    unreadCount() {
      if (!this.notificationMetadata.unreadCount[this.type]) {
        return '';
      }

      return this.notificationMetadata.unreadCount[this.type] < 100
        ? `${this.notificationMetadata.unreadCount[this.type]}`
        : '99+';
    },
    isNotificationPanelActive() {
      return this.$route.name === 'notifications_index';
    },
  },
  methods: {
    ...mapActions('notifications', ['changeNotificationType']),
    openNotificationPanel() {
      if (this.$route.name !== 'notifications_index') {
        this.changeNotificationType(this.type)
        this.$emit('open-notification-panel');
      }
    },
  },
};
</script>

<style scoped lang="scss">
.notifications-link {
  margin-bottom: var(--space-small);
}

.badge {
  position: absolute;
  right: var(--space-minus-smaller);
  top: var(--space-minus-smaller);
}
.notifications-link--button {
  display: flex;
  position: relative;
  border-radius: var(--border-radius-large);
  border: 1px solid transparent;
  color: var(--s-600);
  margin: var(--space-small) 0;

  &:hover {
    background: var(--w-50);
    color: var(--s-600);
  }

  &:focus {
    border-color: var(--w-500);
  }

  &.is-active {
    background: var(--w-50);
    color: var(--w-500);
  }
}
</style>
