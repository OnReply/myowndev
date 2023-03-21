import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';

const state = {
  meta: {
    count: 0,
    currentPage: 1,
    unreadCount: {
      Conversation: 0,
      Article: 0
    },
  },
  records: {},
  uiFlags: {
    isFetching: false,
    isFetchingItem: false,
    isUpdating: false,
    isUpdatingUnreadCount: false,
  },
  type: 'Conversation'
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
