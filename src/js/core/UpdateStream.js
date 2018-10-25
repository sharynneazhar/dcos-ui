import { Observable } from "rxjs/Observable";
import UserSettingsStore from "#SRC/js/stores/UserSettingsStore";
import CosmosPackagesStore from "#SRC/js/stores/CosmosPackagesStore";

// TODO: once every 24 hours
// 24 * 60 * 60 * 1000
const RETRIEVE_DELAY = 2000;

export const UpdateStreamType = Symbol("UpdateStreamType");

function getVersionFromLocalStorage() {
  // TODO: get it properly
  const savedStates = UserSettingsStore.getKey("savedStates");

  return savedStates.dcosUIVersion.version;
}

function setVersionInLocalStorage(version) {
  // TODO: set it properly
  const savedStates = UserSettingsStore.getKey("savedStates");
  savedStates.dcosUIVersion = { version };
  UserSettingsStore.setKey("savedStates", savedStates);
}

function fetchDcosUIVersion() {
  CosmosPackagesStore.fetchPackageVersions("dcos-ui");
}

function getDcosUIVersion() {
  const versionObject = CosmosPackagesStore.getPackageVersions("dcos-ui");
  let version = "";
  if (versionObject) {
    version = Object.keys(versionObject.packageVersions)[0];
  }
  // TODO: What to do when multiple versions?

  return version;
}

export const a = new Observable.timer(0, RETRIEVE_DELAY); // TODO
a.subscribe(() => {
  const version = "2.24.0";
  setVersionInLocalStorage(version);
  fetchDcosUIVersion();

  const localVersion = getVersionFromLocalStorage();
  const newVersion = getDcosUIVersion();
  if (newVersion && localVersion && newVersion > localVersion) {
    console.log(
      "A new version of the package is available! Click here to install " +
        newVersion +
        "."
    );
  } else {
    console.log("No new versions available.");
  }
});
