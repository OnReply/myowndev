/* global axios */
import ApiClient from './ApiClient';

class NotificationsAPI extends ApiClient {
  constructor() {
    super('notifications', { accountScoped: true });
  }

  get(page, type) {
    const url =
      `${this.url}?page=${page}` + (type !== null ? `&type=${type}` : '');
    return axios.get(url);
  }

  getNotifications(contactId) {
    return axios.get(`${this.url}/${contactId}/notifications`);
  }

  getUnreadCount() {
    return axios.get(`${this.url}/unread_count`);
  }

  read(primaryActorType, primaryActorId) {
    return axios.post(`${this.url}/read_all`, {
      primary_actor_type: primaryActorType,
      primary_actor_id: primaryActorId,
    });
  }

  readAll() {
    return axios.post(`${this.url}/read_all`);
  }
}

export default new NotificationsAPI();
