<template>
  <transition name="popover-animation">
    <div class="article-settings--container">
      <h3 class="text-base text-slate-800 dark:text-slate-100">
        {{ $t('HELP_CENTER.ARTICLE_SETTINGS.TITLE') }}
      </h3>
      <div class="form-wrap">
        <label>
          {{ $t('HELP_CENTER.ARTICLE_SETTINGS.FORM.CATEGORY.LABEL') }}
          <multiselect-dropdown
            :options="categories"
            :selected-item="selectedCategory"
            :has-thumbnail="false"
            :multiselector-title="
              $t('HELP_CENTER.ARTICLE_SETTINGS.FORM.CATEGORY.TITLE')
            "
            :multiselector-placeholder="
              $t('HELP_CENTER.ARTICLE_SETTINGS.FORM.CATEGORY.PLACEHOLDER')
            "
            :no-search-result="
              $t('HELP_CENTER.ARTICLE_SETTINGS.FORM.CATEGORY.NO_RESULT')
            "
            :input-placeholder="
              $t(
                'HELP_CENTER.ARTICLE_SETTINGS.FORM.CATEGORY.SEARCH_PLACEHOLDER'
              )
            "
            @click="onClickSelectCategory"
          />
        </label>
        <label>
          {{ $t('HELP_CENTER.ARTICLE_SETTINGS.FORM.AUTHOR.LABEL') }}
          <multiselect-dropdown
            :options="agents"
            :selected-item="assignedAuthor"
            :multiselector-title="
              $t('HELP_CENTER.ARTICLE_SETTINGS.FORM.AUTHOR.TITLE')
            "
            :multiselector-placeholder="
              $t('HELP_CENTER.ARTICLE_SETTINGS.FORM.AUTHOR.PLACEHOLDER')
            "
            :no-search-result="
              $t('HELP_CENTER.ARTICLE_SETTINGS.FORM.AUTHOR.NO_RESULT')
            "
            :input-placeholder="
              $t('HELP_CENTER.ARTICLE_SETTINGS.FORM.AUTHOR.SEARCH_PLACEHOLDER')
            "
            @click="onClickAssignAuthor"
          />
        </label>
        <label>
          {{ $t('HELP_CENTER.ARTICLE_SETTINGS.FORM.EMBED_VIDEO_URL.LABEL') }}
          <input
            v-model="embedVideoUrl"
            type="text"
            :placeholder="
              $t(
                'HELP_CENTER.ARTICLE_SETTINGS.FORM.EMBED_VIDEO_URL.PLACEHOLDER'
              )
            "
            @input="onChangeEmbedUrlInput"
          />
        </label>
        <label>
          {{ $t('HELP_CENTER.ARTICLE_SETTINGS.FORM.META_TITLE.LABEL') }}
          <textarea
            v-model="metaTitle"
            rows="3"
            type="text"
            :placeholder="
              $t('HELP_CENTER.ARTICLE_SETTINGS.FORM.META_TITLE.PLACEHOLDER')
            "
            @input="onChangeMetaInput"
          />
        </label>
        <label>
          {{ $t('HELP_CENTER.ARTICLE_SETTINGS.FORM.META_DESCRIPTION.LABEL') }}
          <textarea
            v-model="metaDescription"
            rows="3"
            type="text"
            :placeholder="
              $t(
                'HELP_CENTER.ARTICLE_SETTINGS.FORM.META_DESCRIPTION.PLACEHOLDER'
              )
            "
            @input="onChangeMetaInput"
          />
        </label>
        <label>
          {{ $t('HELP_CENTER.ARTICLE_SETTINGS.FORM.META_TAGS.LABEL') }}
          <multiselect
            ref="tagInput"
            v-model="metaTags"
            :placeholder="
              $t('HELP_CENTER.ARTICLE_SETTINGS.FORM.META_TAGS.PLACEHOLDER')
            "
            label="name"
            :options="metaOptions"
            track-by="name"
            :multiple="true"
            :taggable="true"
            :close-on-select="false"
            @search-change="handleSearchChange"
            @close="onBlur"
            @tag="addTagValue"
          />
        </label>
      </div>
      <div class="action-buttons">
        <woot-button
          icon="archive"
          size="small"
          variant="clear"
          color-scheme="secondary"
          @click="onClickArchiveArticle"
        >
          {{ $t('HELP_CENTER.ARTICLE_SETTINGS.BUTTONS.ARCHIVE') }}
        </woot-button>
        <woot-button
          icon="delete"
          size="small"
          variant="clear"
          color-scheme="alert"
          @click="onClickDeleteArticle"
        >
          {{ $t('HELP_CENTER.ARTICLE_SETTINGS.BUTTONS.DELETE') }}
        </woot-button>
      </div>
    </div>
  </transition>
</template>

<script>
import MultiselectDropdown from 'shared/components/ui/MultiselectDropdown.vue';
import { mapGetters } from 'vuex';
import { debounce } from '@chatwoot/utils';
import { isEmptyObject } from 'dashboard/helper/commons.js';
export default {
  components: {
    MultiselectDropdown,
  },
  props: {
    article: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      metaTitle: '',
      metaDescription: '',
      metaTags: [],
      metaOptions: [],
      tagInputValue: '',
      embedVideoUrl: '',
    };
  },
  computed: {
    ...mapGetters({
      categories: 'categories/allCategories',
      agents: 'agents/getAgents',
    }),
    assignedAuthor() {
      return this.article?.author;
    },
    selectedCategory() {
      return this.article?.category;
    },
    allTags() {
      return this.metaTags.map(item => item.name);
    },
  },
  mounted() {
    if (!isEmptyObject(this.article.meta || {})) {
      const {
        meta: { title = '', description = '', tags = [] },
      } = this.article;
      this.metaTitle = title;
      this.metaDescription = description;
      this.metaTags = this.formattedTags({ tags });
    }

    this.saveArticle = debounce(
      () => {
        this.$emit('save-article', {
          meta: {
            title: this.metaTitle,
            description: this.metaDescription,
            tags: this.allTags,
          },
          video_url: this.embedVideoUrl,
        });
      },
      1000,
      false
    );
  },
  methods: {
    formattedTags({ tags }) {
      return tags.map(tag => ({
        name: tag,
      }));
    },
    addTagValue(tagValue) {
      const tags = tagValue
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag && !this.allTags.includes(tag));

      this.metaTags.push(...this.formattedTags({ tags: [...new Set(tags)] }));
      this.saveArticle();
    },
    handleSearchChange(value) {
      this.tagInputValue = value;
    },
    onBlur() {
      if (this.tagInputValue) {
        this.addTagValue(this.tagInputValue);
      }
    },
    onClickSelectCategory({ id }) {
      this.$emit('save-article', { category_id: id });
    },
    onClickAssignAuthor({ id }) {
      this.$emit('save-article', { author_id: id });
      this.updateMeta();
    },
    onChangeMetaInput() {
      this.saveArticle();
    },
    onChangeEmbedUrlInput() {
      this.saveArticle();
    },
    onClickArchiveArticle() {
      this.$emit('archive-article');
      this.updateMeta();
    },
    onClickDeleteArticle() {
      this.$emit('delete-article');
      this.updateMeta();
    },
    updateMeta() {
      this.$emit('update-meta');
    },
    ChangeVideoUrl(url) {
      this.embedVideoUrl = url;
    },
  },
  watch: {
    article: {
      handler(newVal) {
        this.ChangeVideoUrl(newVal.video_url);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.article-settings--container {
  @apply flex-[0.3] min-w-[15rem] max-w-[22.5rem] py-2 pl-4 rtl:pl-0 rtl:pr-4 ml-4 rtl:ml-0 rtl:mr-4 overflow-y-auto border-l rtl:border-r rtl:border-l-0 border-solid border-slate-50 dark:border-slate-700;

  .form-wrap {
    @apply mt-4 mb-6;

    textarea {
      @apply text-sm;
    }
  }

  .action-buttons {
    @apply flex flex-col;
  }
}
::v-deep {
  .multiselect {
    @apply mb-0;
  }
  .multiselect__content-wrapper {
    @apply hidden;
  }
  .multiselect--active .multiselect__tags {
    padding-right: var(--space-small) !important;
    @apply rounded-md;
  }
  .multiselect__placeholder {
    @apply text-slate-300 dark:text-slate-200 pt-2 mb-0;
  }
  .multiselect__select {
    @apply hidden;
  }
}
</style>
