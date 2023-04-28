<template>
  <div class="parent-div">
    <div class="medium-9 small mr-2">
      <div class="input-group-field">
        <label for="name" :class="{ error: $v.template.name.$error }">
          Name
          <input
            v-model.trim="template.name"
            name="name"
            type="text"
            placeholder="test"
            @keydown="validateInput"
          />
          <span v-if="$v.template.name.$error" class="message">
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.INBOX_NAME.ERROR') }}
          </span>
        </label>
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
        <label for="language"> Header type </label>
        <select v-model="headerType" @change="UpdateDisplayHeaderInputField" name="headerType">
          <option
            value="text"
          >
            Text
          </option>
          <option
            value="image"
          >
            Image
          </option>
        </select>
      </div>
      <div v-if="displayHeaderInputField" class="input-group-field">
        <label for="" :class="{ error: $v.headerValue.$error }">
          Header
          <input
            v-model.trim="headerValue"
            type="text"
            placeholder="Type a string"
            @input="updateHeaderValue"
          />
          <span v-if="$v.headerValue.$error" class="message">
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.INBOX_NAME.ERROR') }}
          </span>
        </label>
      </div>
      <div v-else class="input-group-field row">
        <label>
          <input
            id="file"
            ref="file"
            type="file"
            accept="image/png, image/jpeg, image/gif"
            @change="handleImageUpload"
          />
          <slot />
        </label>
      </div>
      <div class="input-group-field">
        <label for="body" :class="{ error: $v.bodyValue.$error }"> 
          Body 
          <textarea
            v-model.trim="bodyValue"
            type="text"
            name="body"
            placeholder="Type a string"
            @input="updateBodyValue"
          />
          <span v-if="$v.bodyValue.$error" class="message">
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.INBOX_NAME.ERROR') }}
          </span>
        </label>
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
    <div class="medium-3 whatsapp-chat-background">
      <div class="first-parent">
        <div class="second-parent">
          <div class="third-parent">
            <div class="bg-white rounded padding-1">
              <div v-if="displayHeaderInputField" class="bold padding-left-1">
                {{ headerValue }}
              </div>
              <div v-else>
                <img :src="imageUrl" alt="">
              </div>
              <div class="padding-1 template-body">
                {{ bodyValue }}
              </div>
              <time aria-hidden="true" class="_6xe5">07:26</time>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import facebookLanguageList from '../../../../../helper/facebookLanguagesList.json';
import { required } from 'vuelidate/lib/validators';
import InboxesAPI from '../../../../../api/inboxes';

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
          name: '',
          category: 'UTILITY',
          language: 'en',
          components: [],
        };
      },
    },
  },
  validations: {
    template: {
      name: {
        required,
      }
    },
    headerValue: { required },
    bodyValue: { required }
  },
  data() {
    return {
      templateTypes: ['UTILITY', 'MARKETING', 'AUTHENTICATION'],
      languages: facebookLanguageList,
      bodyValue: '',
      headerValue: '',
      footerValue: '',
      nameError: false,
      headerType: 'text',
      displayHeaderInputField: true,
      imageUrl: '',
      imageFile: ''
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
      this.$v.bodyValue.$touch()
    },
    updateHeaderValue() {
      var component = this.template.components.filter(c => c.type === 'HEADER');
      component[0].text = this.headerValue;
      this.$v.headerValue.$touch()
    },
    updateFooterValue() {
      var component = this.template.components.filter(c => c.type === 'FOOTER');
      component[0].text = this.footerValue;
    },
    validateInput(event) {
      const keyPressed = event.key;
      const alphanumericRegex = /^[0-9a-zA-Z_]+$/;
      if (!alphanumericRegex.test(keyPressed)) {
        event.preventDefault();
        if (keyPressed == ''){
          this.template.name += '_'
        }
      }
      this.$v.template.name.$touch()
    },
    UpdateDisplayHeaderInputField() {
      this.displayHeaderInputField = this.headerType == 'text';
    },
    async handleImageUpload(event) {
      const [file] = event.target.files;
      this.imageFile = file;
      this.imageUrl = file? URL.createObjectURL(file) : '';
    },
    shouldDisableSubmitButton() {
      console.log("checking")
      let disableSubmitButton = this.$v.template.name.$invalid || this.IsHeaderValueInvalid() || this.$v.bodyValue.$invalid
      this.$emit('disable-submit-button', disableSubmitButton)
    },
    IsHeaderValueInvalid() {
      if(this.headerType == 'text') {
        return this.$v.headerValue.$invalid;
      } else {
        return this.imageFile == '';
      }
    },
  },
  watch: {
    template: {
      handler() {
        this.shouldDisableSubmitButton();
      },
      deep: true,
    },
    imageFile: function() {
      this.shouldDisableSubmitButton();
    },
    headerType: function() {
      this.shouldDisableSubmitButton();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../../../../assets/scss/app.scss';
.max-h-full {
  max-height: 60% !important;
}
.whatsapp-chat-background {
  background-color: #e5ddd5;
  box-sizing: border-box;
  position: relative;
  z-index: 0;
  margin: 0.5rem 0.5rem;
}
.whatsapp-chat-background::before {
  background: url(https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/rmr3BrOAAd8.png);
  background-size: 366.5px 666px;
  content: '';
  height: 100%;
  left: 0;
  opacity: 0.06;
  position: absolute;
  top: 0;
  width: 100%;
}

.parent-div {
  display: flex;
  justify-content: space-between;
}
.first-parent {
  margin-left: 8px;
  margin-right: 8px;
  margin-bottom: 12px;
  margin-top: 12px;
}
.second-parent {
  box-sizing: border-box;
  display: inline-block;
  font-family: BlinkMacSystemFont, -apple-system, Roboto, Arial, sans-serif;
  max-width: 100%;
  position: relative;
}
.third-parent {
  background-color: #fff;
  border-radius: 7.5px;
  border-top-left-radius: 0;
  box-shadow: 0 1px 0.5px rgba(0, 0, 0, .15);
  min-height: 20px;
  position: relative;
  word-wrap: break-word;
  min-width: 50px;
}
._6xe5 {
  bottom: 3px;
  color: rgba(0, 0, 0, .4);
  font-size: 11px;
  height: 15px;
  line-height: 15px;
  position: absolute;
  right: 7px;
}
.bold {
  font-weight: bold;
}
.template-body{
  white-space: pre-line;
}
</style>
