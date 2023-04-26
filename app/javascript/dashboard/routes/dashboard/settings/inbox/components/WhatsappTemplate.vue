<template>
  <div class="main-div">
    <div class="add-button-div">
      <woot-submit-button
        button-text="Create New template"
        @click="editTemplate(defaultTempate)"
      />
    </div>
    <div class="mt-2">
      <templates-picker
        :inbox-id="inbox.id"
        classes="max-h-full template__list-container"
        :filter-templates="false"
        @onSelect="editTemplate"
      />
      <woot-modal
        :show.sync="showWhatsAppTemplatesBuilderModal"
        :on-close="onClose"
        size="modal-big"
      >
        <woot-modal-header
          :header-title="$t('WHATSAPP_TEMPLATES.MODAL.TITLE')"
          header-content="Edit your Template"
        />
        <div class="modal-content">
          <whatsapp-template-builder
            :inbox-id="inbox.id"
            :show="showWhatsAppTemplatesBuilderModal"
            :template="template"
            @disable-submit-button="toggleSubmitButton"
          />
        </div>
        <div class="modal-footer">
          <div class="medium-12 row text-center">
            <woot-submit-button
              :button-text="$t('EMAIL_TRANSCRIPT.SUBMIT')"
              @click="submitForm"
              :disabled="isDisabled"
            />
          </div>
        </div>
      </woot-modal>
    </div>
  </div>
</template>

<script>
import TemplatesPicker from '../../../../../components/widgets/conversation/WhatsappTemplates/TemplatesPicker.vue';
import WhatsappTemplateBuilder from './WhatsappTemplateBuilder.vue';
import InboxesAPI from '../../../../../api/inboxes';
export default {
  components: { TemplatesPicker, WhatsappTemplateBuilder },
  props: {
    inbox: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      showWhatsAppTemplatesBuilderModal: false,
      isDisabled: true,
      template: null,
      defaultTempate: {
        category: "UTILITY",
        components : [
          {
            format: "TEXT",
            type: "HEADER",
            text: "",
          },
          {
            type: "BODY",
            text: "",
          },
          {
            type: "FOOTER",
            text: "",
          },
        ],
        language: "en_US",
        name: "",
      }
    };
  },
  computed: {},
  methods: {
    editTemplate(template) {
      this.showWhatsAppTemplatesBuilderModal = true;
      this.template = template;
    },
    onClose() {
      this.showWhatsAppTemplatesBuilderModal = false;
    },
    submitForm() {
      this.onClose();
      InboxesAPI.createTemplate(this.inbox.id, this.template)
    },
    toggleSubmitButton(value) {
      this.isDisabled = value;
    }
  },
};
</script>
<style lang="scss" scoped>
.template__list-container {
  background-color: var(--s-25);
  border-radius: var(--border-radius-medium);
  overflow-y: auto;
  padding: var(--space-one);
}
.modal-content {
  padding: 2.5rem 3.2rem;
}

.add-button-div{
  display: flex;
  justify-content: end;
  margin: 0.8rem ;
}
.main-div {
  margin: 1.2rem;
}
</style>
