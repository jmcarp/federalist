import federalist from '../util/federalistApi';
import github from '../util/githubApi';
import s3 from '../util/s3Api';
import convertFileToData from '../util/convertFileToData';
import alertActions from './alertActions';
import { addPathToSite, uploadFileToSite } from '../util/makeCommitData';
import { formatDraftBranchName } from '../util/branchFormatter';
import findShaForDefaultBranch from '../util/findShaForDefaultBranch';
import filterAssetsWithTypeOfFile from '../util/filterAssetsWithTypeOfFile';

import {
  updateRouterToSitesUri,
  updateRouterToSpecificSiteUri,
  dispatchSitesReceivedAction,
  dispatchSiteAddedAction,
  dispatchSiteUpdatedAction,
  dispatchSiteDeletedAction,
  dispatchSiteFileContentReceivedAction,
  dispatchSiteAssetsReceivedAction,
  dispatchSiteFilesReceivedAction,
  dispatchSiteConfigsReceivedAction,
  dispatchSiteBranchesReceivedAction,
  dispatchSiteInvalidAction,
  dispatchSiteLoadingAction
} from './dispatchActions';


const alertError = error => {
  alertActions.httpError(error.message);
};

export default {
  fetchSites() {
    return federalist.fetchSites()
      .then(dispatchSitesReceivedAction)
      .catch(alertError);
  },

  addSite(siteToAdd) {
    return federalist.addSite(siteToAdd)
      .then(dispatchSiteAddedAction)
      .then(updateRouterToSitesUri)
      .catch(alertError);
  },

  updateSite(site, data) {
    return federalist.updateSite(site, data)
      .then(dispatchSiteUpdatedAction)
      .catch(alertError);
  },

  deleteSite(siteId) {
    return federalist.deleteSite(siteId)
      .then(dispatchSiteDeletedAction.bind(null, siteId))
      .then(updateRouterToSitesUri)
      .catch(alertError);
  },

  fetchBranches(site) {
    return github.fetchBranches(site)
      .then(dispatchSiteBranchesReceivedAction.bind(null, site.id))
      .then(() => site);
  },

  deleteBranch(site, branch) {
    return github.deleteBranch(site, branch).then(() => {
      return this.fetchBranches(site);
    }).catch(alertError);
  },

  cloneRepo(destination, source) {
    return github.createRepo(destination, source).then(() => {
      return federalist.cloneRepo(destination, source);
    }).then((site) => {
      dispatchSiteAddedAction(site);
      updateRouterToSpecificSiteUri(site.id);
    }).catch(alertError);
  },

  siteExists(site) {
    return github.getRepo(site)
      .then(() => site)
      .catch((error) => {
        dispatchSiteLoadingAction(site, false);
        dispatchSiteInvalidAction(site, true);

        throw new Error(error);
      });
  },

  fetchSiteConfigsAndAssets(site) {
    return this.siteExists(site).then((site) => {
      dispatchSiteLoadingAction(site, true);

      this.fetchSiteAssets(site);
      this.fetchSiteNavigationFile(site).then(() => {
        dispatchSiteLoadingAction(site, false);
      });

      return github.fetchRepositoryContent(site).then((files) => {
        dispatchSiteFilesReceivedAction(site.id, files);
        return site;
      }).then((site) => {
        return this.fetchBranches(site);
      }).then((site) => {
        return this.fetchSiteConfigs(site);
      });
    });
  }
};

function throwRuntime(error) {
  const runtimeErrors = ['TypeError'];
  const isRuntimeError = runtimeErrors.find((e) => e === error.name);
  if (isRuntimeError) {
    throw error;
  }
}
