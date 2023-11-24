<template>
  <router-link
    v-slot="{ href, isActive, navigate }"
    :to="to"
    custom
    active-class="active"
  >
    <li
      class="font-medium h-7 my-1 hover:bg-slate-25 hover:text-bg-50 flex items-center px-2 rounded-md dark:hover:bg-slate-800"
      :class="{
        'bg-woot-25 dark:bg-slate-800': isActive,
        'text-ellipsis overflow-hidden whitespace-nowrap max-w-full':
          shouldTruncate,
      }"
      @click="navigate"
    >
      <a
        :href="href"
        class="inline-flex text-left max-w-full w-full items-center"
      >
        <span
          v-if="icon"
          class="inline-flex items-center justify-center w-4 rounded-sm bg-slate-100 dark:bg-slate-700 p-0.5 mr-1.5 rtl:mr-0 rtl:ml-1.5"
        >
          <fluent-icon
            class="text-xxs text-slate-700 dark:text-slate-200"
            :class="{
              'text-woot-500 dark:text-woot-500': isActive,
            }"
            :icon="icon"
            size="12"
          />
        </span>

        <span
          v-if="labelColor"
          class="inline-flex rounded-sm bg-slate-100 h-3 w-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5 border border-slate-50 dark:border-slate-900"
          :style="{ backgroundColor: labelColor }"
        />
        <div
          class="items-center flex overflow-hidden whitespace-nowrap text-ellipsis w-full justify-between"
        >
          <span
            :title="menuTitle"
            class="text-sm text-slate-700 dark:text-slate-100"
            :class="{
              'text-woot-500 dark:text-woot-500': isActive,
              'text-ellipsis overflow-hidden whitespace-nowrap max-w-full':
                shouldTruncate,
            }"
          >
            {{ label }}
          </span>
          <span
            v-if="showChildCount"
            class="bg-slate-50 dark:bg-slate-700 rounded text-xxs font-medium mx-1 py-0 px-1"
            :class="
              isCountZero
                ? `text-slate-300 dark:text-slate-700`
                : `text-slate-700 dark:text-slate-50`
            "
          >
            {{ childItemCount }}
          </span>
        </div>
        <span
          v-if="warningIcon"
          class="inline-flex rounded-sm mr-1 bg-slate-100"
          @click="startLogin"
        >
          <fluent-icon
            v-tooltip.top-end="$t('SIDEBAR.FACEBOOK_REAUTHORIZE')"
            class="text-xxs"
            :icon="warningIcon"
            size="12"
          />
        </span>
      </a>
    </li>
  </router-link>
</template>
<script>
import {
  loadFBsdk,
  initFB,
} from '../../../../shared/helpers/facebookInitializer';
import { mapGetters } from 'vuex';

import alertMixin from 'shared/mixins/alertMixin';

export default {
  props: {
    to: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    labelColor: {
      type: String,
      default: '',
    },
    shouldTruncate: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    warningIcon: {
      type: String,
      default: '',
    },
    showChildCount: {
      type: Boolean,
      default: false,
    },
    childItemCount: {
      type: Number,
      default: 0,
    },
    provider: {
      type: String,
      default: null
    },
    providerConfig: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'getCurrentUser',
    }),
    showIcon() {
      return {
        'overflow-hidden whitespace-nowrap text-ellipsis': this.shouldTruncate,
      };
    },
    isCountZero() {
      return this.childItemCount === 0;
    },
    menuTitle() {
      return this.shouldTruncate ? this.label : '';
    },
  },
  data() {
    return {
      hasLoginStarted: false,
    }
  },
  mixins: [alertMixin],
  mounted() {
    if (this.provider =="whatsapp_cloud" && this.currentUser.role === 'administrator'){

      loadFBsdk();
      initFB();
    }
  },
  methods: {
    startLogin() {
      if (this.provider =="whatsapp_cloud" && this.currentUser.role === 'administrator' && !this.hasLoginStarted)
      {
        this.hasLoginStarted = true;
        this.tryFBlogin();
      }
    },
    tryFBlogin() {
      FB.login(
        response => {
          if (response.status === 'connected') {
            // this.isFbConnected = true;
            this.hasLoginStarted = false;
            // this.whatsAppInboxAPIKey = response.authResponse.accessToken;
            this.updateWhatsAppInboxAPIKey(response.authResponse.accessToken);
          } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            this.emptyStateMessage = this.$t(
              'INBOX_MGMT.DETAILS.ERROR_FB_AUTH'
            );
          } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            this.hasLoginStarted = false;
            this.emptyStateMessage = this.$t(
              'INBOX_MGMT.DETAILS.ERROR_FB_AUTH'
            );
          }
        },
        {
          scope: 'whatsapp_business_management,whatsapp_business_messaging',
        }
      );
    },
    async updateWhatsAppInboxAPIKey(whatsAppInboxAPIKey) {
      const pattern = /\/inbox\/(\d+)/;
      const match = this.to.match(pattern);
      if (!match) return;
      try {
        const payload = {
          id: match[1],
          formData: false,
          channel: {},
        };

        payload.channel.provider_config = {
          ...this.providerConfig,
          api_key: whatsAppInboxAPIKey,
        };

        await this.$store.dispatch('inboxes/updateInbox', payload);
        this.showAlert(this.$t('INBOX_MGMT.EDIT.API.SUCCESS_MESSAGE'));
      } catch (error) {
        console.log(error)
        this.showAlert(this.$t('INBOX_MGMT.EDIT.API.ERROR_MESSAGE'));
      }
    },
  }
};
</script>
