import keymirror from 'keymirror';

export const navigationTypes = keymirror({
  // Action when route has changed
  ROUTE_CHANGED: null
});

export const routeTypes = keymirror({
  // Represents dashboard/site listing page
  DASHBOARD: null,
  // Represents page to add new sites
  NEW_SITE: null,
  // Represents the main page for a site
  SITE: null,
  // Represents a site builds page
  SITE_BUILDS: null,
  // Represents a site setting page
  SITE_SETTINGS: null,
});

export const siteActionTypes = keymirror({
  // Action to add a site
  SITE_ADD: null,
  SITE_BRANCH_DELETED: null,
  SITE_FILE_ADDED: null,
  // When an individual file/path is received
  SITE_FILE_CONTENT_RECEIVED: null,
  SITE_UPLOAD_RECEIVED: null
});

//TODO: Is there a way to generate this dynamically with a loop?
export const sideNavPaths = {
  SETTINGS: 'settings',
  BUILDS: 'builds'
};
