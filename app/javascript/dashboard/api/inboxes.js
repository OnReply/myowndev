/* global axios */
import ApiClient from './ApiClient';

class Inboxes extends ApiClient {
  constructor() {
    super('inboxes', { accountScoped: true });
  }

  getCampaigns(inboxId) {
    return axios.get(`${this.url}/${inboxId}/campaigns`);
  }

  deleteInboxAvatar(inboxId) {
    return axios.delete(`${this.url}/${inboxId}/avatar`);
  }

  refreshToken(inboxId, refreshed) {
    return axios.post(`${this.url}/${inboxId}/refresh_token`, {
      refreshed: refreshed,
    });
  }

  getAgentBot(inboxId) {
    return axios.get(`${this.url}/${inboxId}/agent_bot`);
  }

  createTemplate(inboxId, template, headerType, image) {
    var params_template = template
    params_template.components = template.components.filter(component=> component.text)
    const formData = new FormData();
    if (headerType == 'image') {
      formData.append("image", image);
    }
    formData.append("template", JSON.stringify(params_template));
    formData.append("header_type", headerType);
    return axios.post(`${this.url}/${inboxId}/template`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  setAgentBot(inboxId, botId) {
    return axios.post(`${this.url}/${inboxId}/set_agent_bot`, {
      agent_bot: botId,
    });
  }

  deleteTemplate(inboxId, template) {
    return axios.delete(`${this.url}/${inboxId}/delete_template?name=${template.name}`);
  }
}

export default new Inboxes();
