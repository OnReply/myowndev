<template>
  <div class="h-auto overflow-auto flex flex-col">
    <div class="flex flex-row">
      <div class="w-full">
        <div class="h-[calc(100vh-56px)] relative">
          <csml-monaco-editor v-model="bot.csmlContent" class="w-full h-full" />
          <div
            v-if="$v.bot.csmlContent.$error"
            class="bg-red-100 dark:bg-red-200 text-white dark:text-white absolute bottom-0 w-full p-2.5 flex items-center text-xs justify-center flex-shrink-0"
          >
            <span>{{ $t('AGENT_BOTS.CSML_BOT_EDITOR.BOT_CONFIG.ERROR') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import CsmlMonacoEditor from './CSMLMonacoEditor.vue';

export default {
  components: { CsmlMonacoEditor },
  props: {
    agentBot: {
      type: Object,
      default: () => {},
    },
  },
  validations: {
    bot: {
      name: { required },
      csmlContent: { required },
    },
  },
  data() {
    return {
      bot: {
        name: this.agentBot.name || '',
        description: this.agentBot.description || '',
        csmlContent: this.agentBot.bot_config.csml_content || '',
      },
    };
  },
  methods: {
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      this.$emit('submit', {
        id: this.agentBot.id || '',
        ...this.bot,
      });
    },
  },
};
</script>
