import React from 'react';

export const IconAdd = ({ className = 'icon', title = 'Add' }) => (
  <svg className={className} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <title>{title}</title>
    <path fill="currentColor" d="M11 11V5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6z"/>
  </svg>
);

export const IconTrash = ({ className = 'icon', title = 'Remove' }) => (
  <svg className={className} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <title>{title}</title>
    <path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

export const IconRefresh = ({ className = 'icon', title = 'Refresh' }) => (
  <svg className={className} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <title>{title}</title>
    <path fill="currentColor" d="M17.65 6.35A7.95 7.95 0 0 0 12 4V1L8 5l4 4V6c2.21 0 4.2.9 5.65 2.35A6 6 0 1 1 6 12H4a8 8 0 1 0 13.65-5.65z"/>
  </svg>
);

export const IconSun = ({ className = 'icon', title = 'Light' }) => (
  <svg className={className} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <title>{title}</title>
    <path fill="currentColor" d="M6.76 4.84l-1.8-1.79L3.17 5 4.96 6.79 6.76 4.84zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zm7.04-2.46l1.79 1.79 1.41-1.41-1.8-1.79-1.4 1.41zM20 11v2h3v-2h-3zM4.22 19.78l1.79-1.79-1.41-1.41L2.8 18.37 4.22 19.78zM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM11 1h2v3h-2V1zM17.24 4.84l1.79 1.79 1.41-1.41-1.79-1.79-1.41 1.41z" />
  </svg>
);

export const IconMoon = ({ className = 'icon', title = 'Dark' }) => (
  <svg className={className} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <title>{title}</title>
    <path fill="currentColor" d="M12 2a9.99 9.99 0 0 0 0 20c5.5 0 10-4.5 10-10 0-1.56-.34-3.03-.94-4.36A8 8 0 0 1 12 2z"/>
  </svg>
);
