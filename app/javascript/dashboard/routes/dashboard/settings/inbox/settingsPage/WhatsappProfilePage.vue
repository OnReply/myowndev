<template>
	<div>
		<div class="m-2">
			
			<div class="input-group-field row  align-items-center">
				<label>
					Profile Picture
					<img :src="imageUrl" class="profile-pic m-2" alt="">
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
		</div>
		<woot-submit-button
			:button-text="$t('EMAIL_TRANSCRIPT.SUBMIT')"
			class="m-2"
			@click="submitForm"
			:disabled="isDisabled"
		/>
	</div>
</template>

<script>
import InboxesAPI from '../../../../../api/inboxes'
import alertMixin from 'shared/mixins/alertMixin';

export default {
	props: {
		inbox: {
      type: Object,
      default() {
        return {};
      },
    },
	},
	mixins: [alertMixin],
	data() {
		return {
			imageUrl: '',
			imageFile: '',
			isDisabled: true,
		}
	},
	methods: {
		async handleImageUpload(event) {
      const [file] = event.target.files;
      this.imageFile = file;
      this.imageUrl = file? URL.createObjectURL(file) : '';
    },
		async submitForm() {
      const response = await InboxesAPI.UpdateProfilePicture(this.inbox.id, this.imageFile)
      if(response.data.message) {
        this.showAlert(this.$t('WHATSAPP_TEMPLATES.BUILDER.SUCCESSFUL_SUBMISSION'))
      } else {
        this.showAlert(response.data.error)
      }
    },
	},
	watch: {
		inbox: {
			handler(val){
				this.imageUrl = val.profile_picture_url
			},
			deep: true,
			immediate: true, 
		},
		imageFile(newVal){
			if(newVal === undefined){
				this.imageUrl = this.inbox.profile_picture_url
				this.isDisabled = true
			} else {
				this.isDisabled = false
			}
		}
	}
}
</script>

<style scoped>
.profile-pic{
	border-radius: 100%;
	width: 100px;
	height: 100px;
	border: 1px solid grey;
}
.m-2{
	margin: 2rem;
}
.align-items-center {
	align-items: center;
}
</style>
