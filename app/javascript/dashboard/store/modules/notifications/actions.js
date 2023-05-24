import types from '../../mutation-types';
import NotificationsAPI from '../../../api/notifications';

export const actions = {
  get: async ({ commit }, { page = 1, type = null } = {}) => {
    commit(types.SET_NOTIFICATIONS_UI_FLAG, { isFetching: true });
    try {
      const {
        data: {
          data: { payload, meta },
        },
      } = await NotificationsAPI.get(page, type);
      commit(types.CLEAR_NOTIFICATIONS);
      commit(types.SET_NOTIFICATIONS, payload);
      commit(types.SET_NOTIFICATIONS_META, meta);
      commit(types.SET_NOTIFICATIONS_UI_FLAG, { isFetching: false });
    } catch (error) {
      commit(types.SET_NOTIFICATIONS_UI_FLAG, { isFetching: false });
    }
  },
  unReadCount: async ({ commit } = {}) => {
    commit(types.SET_NOTIFICATIONS_UI_FLAG, { isUpdatingUnreadCount: true });
    try {
      const { data } = await NotificationsAPI.getUnreadCount();
      commit(types.SET_NOTIFICATIONS_UNREAD_COUNT, data);
      commit(types.SET_NOTIFICATIONS_UI_FLAG, { isUpdatingUnreadCount: false });
    } catch (error) {
      commit(types.SET_NOTIFICATIONS_UI_FLAG, { isUpdatingUnreadCount: false });
    }
  },
  read: async (
    { commit },
    { primaryActorType, primaryActorId, unreadCount }
  ) => {
    try {
      await NotificationsAPI.read(primaryActorType, primaryActorId);
      commit(types.SET_NOTIFICATIONS_UNREAD_COUNT, {[primaryActorType]: unreadCount - 1} );
      commit(types.UPDATE_NOTIFICATION, primaryActorId);
    } catch (error) {
      throw new Error(error);
    }
  },
  readAll: async ({ commit }) => {
    commit(types.SET_NOTIFICATIONS_UI_FLAG, { isUpdating: true });
    try {
      await NotificationsAPI.readAll();
      var data = {
        "Conversation": 0,
        "Article": 0
      }
      commit(types.SET_NOTIFICATIONS_UNREAD_COUNT, data);
      commit(types.UPDATE_ALL_NOTIFICATIONS);
      commit(types.SET_NOTIFICATIONS_UI_FLAG, { isUpdating: false });
    } catch (error) {
      commit(types.SET_NOTIFICATIONS_UI_FLAG, { isUpdating: false });
      throw new Error(error);
    }
  },

  addNotification({ commit }, data) {
    commit(types.ADD_NOTIFICATION, data);
  },
  changeNotificationType({ commit }, type) {
    commit(types.CHANGE_NOTIFICATION_TYPE, type);
  },
};
