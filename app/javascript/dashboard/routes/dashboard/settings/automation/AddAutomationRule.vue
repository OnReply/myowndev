<template>
  <div>
    <woot-modal-header :header-title="$t('AUTOMATION.ADD.TITLE')" />
    <div class="flex flex-col modal-content">
      <div class="w-full">
        <woot-input
          v-model="automation.name"
          :label="$t('AUTOMATION.ADD.FORM.NAME.LABEL')"
          type="text"
          :class="{ error: $v.automation.name.$error }"
          :error="
            $v.automation.name.$error
              ? $t('AUTOMATION.ADD.FORM.NAME.ERROR')
              : ''
          "
          :placeholder="$t('AUTOMATION.ADD.FORM.NAME.PLACEHOLDER')"
          @blur="$v.automation.name.$touch"
        />
        <woot-input
          v-model="automation.description"
          :label="$t('AUTOMATION.ADD.FORM.DESC.LABEL')"
          type="text"
          :class="{ error: $v.automation.description.$error }"
          :error="
            $v.automation.description.$error
              ? $t('AUTOMATION.ADD.FORM.DESC.ERROR')
              : ''
          "
          :placeholder="$t('AUTOMATION.ADD.FORM.DESC.PLACEHOLDER')"
          @blur="$v.automation.description.$touch"
        />
        <div class="event_wrapper">
          <label :class="{ error: $v.automation.event_name.$error }">
            {{ $t('AUTOMATION.ADD.FORM.EVENT.LABEL') }}
            <select v-model="automation.event_name" @change="onEventChange()">
              <option
                v-for="event in automationRuleEvents"
                :key="event.key"
                :value="event.key"
              >
                {{ event.value }}
              </option>
            </select>
            <span v-if="$v.automation.event_name.$error" class="message">
              {{ $t('AUTOMATION.ADD.FORM.EVENT.ERROR') }}
            </span>
          </label>
          <p v-if="hasAutomationMutated" class="info-message">
            {{ $t('AUTOMATION.FORM.RESET_MESSAGE') }}
          </p>
        </div>
        <!-- // Conditions Start -->
        <section>
          <label>
            {{ $t('AUTOMATION.ADD.FORM.CONDITIONS.LABEL') }}
          </label>
          <div
            class="w-full p-4 bg-slate-25 dark:bg-slate-700 rounded-lg border border-solid border-slate-50 dark:border-slate-700 mb-4"
          >
            <filter-input-box
              v-for="(condition, i) in automation.conditions"
              :key="i"
              v-model="automation.conditions[i]"
              :filter-attributes="getAttributes(automation.event_name)"
              :input-type="getInputType(automation.conditions[i].attribute_key)"
              :operators="getOperators(automation.conditions[i].attribute_key)"
              :dropdown-values="
                getConditionDropdownValues(
                  automation.conditions[i].attribute_key
                )
              "
              :show-query-operator="i !== automation.conditions.length - 1"
              :custom-attribute-type="
                getCustomAttributeType(automation.conditions[i].attribute_key)
              "
              :v="$v.automation.conditions.$each[i]"
              :has-whatsapp-action="automation.actions.some(action => action.action_name === 'send_whatsapp_template') "
              :should-disable="shouldDisable(i,automation.conditions[i].attribute_key)"
              :is-event-message-created="automation.event_name == 'message_created'"
              @resetFilter="resetFilter(i, automation.conditions[i])"
              @removeFilter="removeFilter(i)"
            />
            <div class="mt-4">
              <woot-button
                icon="add"
                color-scheme="success"
                variant="smooth"
                size="small"
                @click="appendNewCondition"
              >
                {{ $t('AUTOMATION.ADD.CONDITION_BUTTON_LABEL') }}
              </woot-button>
            </div>
          </div>
        </section>
        <!-- // Conditions End -->
        <!-- // Actions Start -->
        <section>
          <label>
            {{ $t('AUTOMATION.ADD.FORM.ACTIONS.LABEL') }}
          </label>
          <div
            class="w-full p-4 bg-slate-25 dark:bg-slate-700 rounded-lg border border-solid border-slate-50 dark:border-slate-700 mb-4"
          >
            <automation-action-input
              v-for="(action, i) in automation.actions"
              :key="i"
              v-model="automation.actions[i]"
              :action-types="automationActionTypes"
              :dropdown-values="
                getActionDropdownValues(automation.actions[i].action_name)
              "
              :show-action-input="
                showActionInput(automation.actions[i].action_name)
              "
              :v="$v.automation.actions.$each[i]"
              @changeImage="changeImage"
              @resetAction="resetAction(i)"
              @removeAction="removeAction(i)"
              @addWhatsappDefaultCondition="addWhatsappDefaultCondition()"
            />
            <div class="mt-4">
              <woot-button
                icon="add"
                color-scheme="success"
                variant="smooth"
                size="small"
                @click="appendNewAction"
              >
                {{ $t('AUTOMATION.ADD.ACTION_BUTTON_LABEL') }}
              </woot-button>
            </div>
          </div>
        </section>
        <!-- // Actions End -->
        <div class="w-full">
          <div class="flex flex-row justify-end gap-2 py-2 px-0 w-full">
            <woot-button class="button clear" @click.prevent="onClose">
              {{ $t('AUTOMATION.ADD.CANCEL_BUTTON_TEXT') }}
            </woot-button>
            <woot-button @click="submitAutomation">
              {{ $t('AUTOMATION.ADD.SUBMIT') }}
            </woot-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import alertMixin from 'shared/mixins/alertMixin';
import automationMethodsMixin from 'dashboard/mixins/automations/methodsMixin';
import automationValidationsMixin from 'dashboard/mixins/automations/validationsMixin';
import filterInputBox from 'dashboard/components/widgets/FilterInput/Index.vue';
import automationActionInput from 'dashboard/components/widgets/AutomationActionInput.vue';

import {
  AUTOMATION_RULE_EVENTS,
  AUTOMATION_ACTION_TYPES,
  AUTOMATIONS,
} from './constants';
export default {
  components: {
    filterInputBox,
    automationActionInput,
  },
  mixins: [alertMixin, automationMethodsMixin, automationValidationsMixin],
  props: {
    onClose: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      automationTypes: JSON.parse(JSON.stringify(AUTOMATIONS)),
      automationRuleEvent: AUTOMATION_RULE_EVENTS[0].key,
      automationRuleEvents: AUTOMATION_RULE_EVENTS,
      automationActionTypes: AUTOMATION_ACTION_TYPES,
      automationMutated: false,
      show: true,
      automation: {
        name: null,
        description: null,
        event_name: 'conversation_created',
        conditions: [
          {
            attribute_key: "status",
            custom_attribute_type: "",
            filter_operator: "equal_to",
            query_operator: "and",
            values: ""
          }
        ],
        actions: [
          {
            action_name: 'assign_agent',
            action_params: [],
          },
        ],
      },
      showDeleteConfirmationModal: false,
      allCustomAttributes: [],
      mode: 'create',
      image: null,
    };
  },
  created() {
    const isFeatureEnabledonAccount = this.$store.getters['accounts/isFeatureEnabledonAccount'];
    const id = this.$store.getters['getCurrentAccountId'];
    const ecomActions = 
    [
      {
        key: 'close_conversation',
        label: 'Close Conversation after 24 hours',
        inputType: null,
      }
    ]
    const lastObject = this.automationActionTypes[this.automationActionTypes.length - 1];
    if( isFeatureEnabledonAccount(id, 'ecommerece') && lastObject.key !== 'close_conversation' )
    {
      this.automationActionTypes.push(...ecomActions)
    }
  },
  computed: {
    hasAutomationMutated() {
      if (
        this.automation.conditions[0].values ||
        this.automation.actions[0].action_params.length
      )
        return true;
      return false;
    },
  },
  mounted() {
    this.$store.dispatch('inboxes/get');
    this.$store.dispatch('agents/get');
    this.$store.dispatch('contacts/get');
    this.$store.dispatch('teams/get');
    this.$store.dispatch('labels/get');
    this.$store.dispatch('campaigns/get');
    this.allCustomAttributes = this.$store.getters['attributes/getAttributes'];
    this.manifestCustomAttributes();
  },
};
</script>
<style lang="scss" scoped>
.event_wrapper {
  select {
    @apply m-0;
  }
  .info-message {
    @apply text-xs text-green-500 dark:text-green-500 text-right;
  }

  @apply mb-6;
}
</style>
