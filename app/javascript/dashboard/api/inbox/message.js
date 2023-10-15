/* eslint no-console: 0 */
/* global axios */
import ApiClient from '../ApiClient';

export const buildCreatePayload = ({
  message,
  isPrivate,
  contentAttributes,
  echoId,
  files,
  ccEmails = '',
  bccEmails = '',
  templateParams,
  image
}) => {
  let payload;
  if ((files && files.length !== 0) || (image)) {
    payload = new FormData();
    if (message) {
      payload.append('content', message);
    }
    if(files && files.length > 0){
      files.forEach(file => {
        payload.append('attachments[]', file);
      });
    }
    if(image) {
      payload.append('image', image)
      // payload.append('content_attributes', contentAttributes)'
      for(var key in templateParams) {
        if (key == 'processed_params') continue; 
        payload.append(`template_params[${key}]`, templateParams[key])
      }
      for(var key in templateParams['processed_params']) {
        payload.append(`template_params[processed_params][${key}]`, templateParams["processed_params"][key])
      }
    }
    if (isPrivate !== undefined) payload.append('private', isPrivate);
    payload.append('echo_id', echoId);
    payload.append('cc_emails', ccEmails);
    payload.append('bcc_emails', bccEmails);
  } else {
    payload = {
      content: message,
      private: isPrivate,
      echo_id: echoId,
      content_attributes: contentAttributes,
      cc_emails: ccEmails,
      bcc_emails: bccEmails,
      template_params: templateParams,
    };
  }
  return payload;
};

class MessageApi extends ApiClient {
  constructor() {
    super('conversations', { accountScoped: true });
  }

  create({
    conversationId,
    message,
    private: isPrivate,
    contentAttributes,
    echo_id: echoId,
    files,
    ccEmails = '',
    bccEmails = '',
    templateParams,
    image
  }) {
    return axios({
      method: 'post',
      url: `${this.url}/${conversationId}/messages`,
      data: buildCreatePayload({
        message,
        isPrivate,
        contentAttributes,
        echoId,
        files,
        ccEmails,
        bccEmails,
        templateParams,
        image
      }),
    });
  }

  delete(conversationID, messageId) {
    return axios.delete(`${this.url}/${conversationID}/messages/${messageId}`);
  }

  getPreviousMessages({ conversationId, after, before }) {
    const params = { before };
    if (after && Number(after) !== Number(before)) {
      params.after = after;
    }
    return axios.get(`${this.url}/${conversationId}/messages`, { params });
  }

  translateMessage(conversationId, messageId, targetLanguage) {
    return axios.post(
      `${this.url}/${conversationId}/messages/${messageId}/translate`,
      {
        target_language: targetLanguage,
      }
    );
  }
}

export default new MessageApi();
