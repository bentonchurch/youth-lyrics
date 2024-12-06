import { TabManager, TabEditor } from '../../modules/tab/index.js'

// Url input elements
const urlInput = document.getElementById("tab-url-input");
const urlButton = document.getElementById("tab-url-button");
const urlErrorDiv = document.getElementById("tab-url-error");
const urlErrorText = document.getElementById("tab-url-error-text");
const urlInputSpinner = document.getElementById("tab-url-spinner");
const urlHeading = document.getElementById("tab-url-heading");

// Tab metadata elements
const tabNameElement = document.getElementById("tab-name");
const tabIdElement = document.getElementById("tab-id");
const tabArtistElement = document.getElementById("tab-artist");
const tabUploaderElement = document.getElementById("tab-uploader");
const tabMetadataHeading = document.getElementById("tab-metadata-heading");
const tabImportedAlreadyWarning = document.getElementById("reimporting-song-warning");

// Common
function hideElement(element) {
  element.classList.add("hidden");
}

function unhideElement(element) {
  element.classList.remove("hidden");
}

// Url related stuff
function showError(error) {
  urlErrorText.innerHTML = error;
  unhideElement(urlErrorDiv);
}

function validateUrl(url) {
  const urlRegex = /https:\/\/tabs\.ultimate-guitar\.com\/tab\/.*\/.*[0-9]*/i;
  const isValid = urlRegex.test(url);

  if (!isValid) {
    showError("Please enter a valid Ultimate Guitar url")
  }

  return isValid;
}

async function onUrlSubmit() {
  const tabUrl = urlInput.value.trim().toLowerCase();
  const isValid = validateUrl(tabUrl);

  if (isValid) {
    hideElement(urlErrorDiv);
    unhideElement(urlInputSpinner);

    let tab;
    try {
      tab = await TabManager.loadFromUrl(tabUrl);
      updateTabMetadata(tab);
      hideElement(urlHeading);
      unhideElement(tabMetadataHeading);

      if (TabManager.get(tab.id)) {
        unhideElement(tabImportedAlreadyWarning);
      }
      
      new TabEditor(tab, document.getElementById("tab-editor"));
    } catch (e) {
      showError("We could not load that tab.  Please try again.")
    }

    hideElement(urlInputSpinner);

    console.log(tab);
  }
}

urlButton.addEventListener("click", onUrlSubmit);
urlInput.addEventListener("keydown", (event) => {
  if (event.key === 'Enter') {
    onUrlSubmit();
  }
});

// Tab metadata display stuff
function updateTabMetadata(tab) {
  tabNameElement.innerText = tab.name;
  tabNameElement.href = tab.url;
  tabIdElement.innerText = `#${tab.id}`;
  tabArtistElement.innerText = tab.artist;
  tabArtistElement.href = tab.artistUrl;
  tabUploaderElement.innerText = tab.uploader;
  tabUploaderElement.href = tab.uploaderUrl;
}