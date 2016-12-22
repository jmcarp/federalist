import fetch from './fetch';

import store from '../store';
import { encodeB64, decodeB64 } from './encoding';
import alertActions from '../actions/alertActions';

const API = 'https://api.github.com';

const getToken = () => {
  const state = store.getState();
  return state.user.githubAccessToken;
}

const getRepoFor = (site) => {
  return `repos/${site.owner}/${site.repository}`;
};

const github = {
  fetch(path, params) {
    const url = `${API}/${path}`;

    return fetch(url, params).then((data) => {
      return data;
    });
  },

  getRepo(site) {
    const url = `${getRepoFor(site)}`;
    const params = { access_token: getToken() };

    return this.fetch(url, { params });
  },

  fetchBranches(site) {
    const url = `${getRepoFor(site)}/branches`;
    const params = {
      access_token: getToken()
    };

    return this.fetch(url, { params });
  },

  fetchPullRequests(site) {
    const url = `${getRepoFor(site)}/pulls`;
    const params = {
      access_token: getToken()
    };

    return this.fetch(url, { params });
  },

  /**
   * creates a new github repo at the user's account
   * @param  {Object} destination Repo to be created
   *                              keys:
   *                              	repo: String:required
   *                              	organization: String (default to 'user')
   *                              	branch: String (default to 'master')
   *                              	engine: String (default to 'jekyll')
   *
   * }
   * @param  {Object} source      Repo to be cloned
   *                              keys:
   *                              	owner: String:required
   *                              	repo: String:required
   * @return {Promise}
   */
  createRepo(destination, source) {
    const token = getToken();
    const params = {
      access_token: token
    };
    const sourceUrl = `repos/${source.owner}/${source.repo}`;

    /**
     * Issue a POST request to github to create a new repository for the user
     * @param  {Object} destination keys:
     *                              	repo:String required
     *                              	organization:String
     * @return {Promise}
     */
    function createRepo(destination) {
      const org = destination.organization ?
        `orgs/${destination.organization}` : 'user';

      const repoUrl = `${org}/repos`;

      return this.fetch(repoUrl, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`
        },
        data: {
          name: destination.repo
        }
      });
    }

    return this.fetch(sourceUrl, { params })
      .then(createRepo.bind(this, destination));
  }
}

export default github;
