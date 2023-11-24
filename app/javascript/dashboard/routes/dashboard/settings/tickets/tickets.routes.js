import SettingsContent from '../Wrapper';
import TicketsHome from './Index';
import { frontendURL } from '../../../../helper/URLHelper';

export default {
  routes: [
    {
      path: frontendURL('accounts/:accountId/tickets'),
      component: SettingsContent,
      props: {
        headerTitle: 'TICKETS.HEADER',
        icon: 'ticket',
        showNewButton: false,
      },
      children: [
        {
          path: '',
          name: 'tickets_wrapper',
          redirect: 'dashboard',
        },
        {
          path: 'dashboard',
          name: 'tickets',
          roles: ['administrator', 'agent'],
          component: TicketsHome,
        },
      ],
    },
  ],
};