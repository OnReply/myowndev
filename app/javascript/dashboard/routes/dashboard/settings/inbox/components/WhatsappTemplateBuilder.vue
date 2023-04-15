<template>
  <div class="columns small">
    <div class="input-group-field">
      <woot-input
        v-model.trim="template.name"
        type="text"
        placeholder="test"
        label="test"
      />
    </div>
    <div class="input-group-field">
      <label for="category"> Category </label>
      <select v-model="template.category" name="category">
        <option v-for="t in templateTypes" :key="t" :value="t">
          {{ t }}
        </option>
      </select>
    </div>
    <div class="input-group-field">
      <label for="language"> Language </label>
      <select v-model="template.language" name="language">
        <option
          v-for="language in languages"
          :key="language.code"
          :value="language.code"
        >
          {{ language.language }}
        </option>
      </select>
    </div>
    <div class="input-group-field">
      <woot-input
        v-model.trim="headerValue"
        type="text"
        placeholder="Type a string"
        label="Header"
        @input="updateHeaderValue"
      />
    </div>
    <div class="input-group-field">
      <label for="body"> Body </label>
      <textarea
        v-model.trim="bodyValue"
        type="text"
        name="body"
        placeholder="Type a string"
        @input="updateBodyValue"
      />
    </div>
    <div class="input-group-field">
      <woot-input
        v-model.trim="footerValue"
        type="text"
        placeholder="Type a string"
        label="Footer"
        @input="updateFooterValue"
      />
    </div>
  </div>
</template>

<script>
import facebookLanguageList from '../../../../../helper/facebookLanguagesList.json';
export default {
  components: {
  },
  props: {
    inboxId: {
      type: Number,
      default: undefined,
    },
    show: {
      type: Boolean,
      default: true,
    },
    template: {
      type: Object,
      default() {
        return {
          name: 'test',
          category: 'UTILITY',
          language: 'en',
          components: [],
        };
      },
    },
  },
  data() {
    return {
      templateTypes: ['UTILITY', 'MARKETING', 'AUTHENTICATION'],
      languages: facebookLanguageList,
      bodyValue: '',
      headerValue: '',
      footerValue: '',
    };
  },
  mounted() {
    this.getComponentValues();
  },
  methods: {
    getComponentValues() {
      this.template.components.forEach(component => {
        if (component.type === 'HEADER') {
          this.headerValue = component.text;
        } else if (component.type === 'BODY') {
          this.bodyValue = component.text;
        } else if (component.type === 'FOOTER') {
          this.footerValue = component.text;
        }
      });
    },
    updateBodyValue() {
      var component = this.template.components.filter(c => c.type === 'BODY');
      component[0].text = this.bodyValue;
    },
    updateHeaderValue() {
      var component = this.template.components.filter(c => c.type === 'HEADER');
      component[0].text = this.headerValue;
    },
    updateFooterValue() {
      var component = this.template.components.filter(c => c.type === 'FOOTER');
      component[0].text = this.footerValue;
    },
  },
};
</script>

<style lang="scss" scoped>
.max-h-full {
  max-height: 60% !important;
}
</style>
