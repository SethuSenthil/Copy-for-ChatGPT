// Define the default settings
const DEFAULT_SETTINGS = {
  copyUserPromptToClipboard: true
};

// Load the settings from storage
chrome.storage.sync.get(DEFAULT_SETTINGS, function(settings) {
  // Apply the settings to the extension
  const copyUserPromptCheckbox = document.getElementById("copyUserPromptToClipboard");
  copyUserPromptCheckbox.checked = settings.copyUserPromptToClipboard;
});

// Save the settings when they are changed
function saveSettings() {
  const settings = {
    copyUserPromptToClipboard: document.getElementById("copyUserPromptToClipboard").checked
  };
  chrome.storage.sync.set(settings);
}

// Create the settings UI
const settingsDiv = document.createElement("div");
settingsDiv.innerHTML = `
  <label>
    <input type="checkbox" id="copyUserPromptToClipboard">
    Copy User Prompt To Clipboard Enabled
  </label>
`;
settingsDiv.addEventListener("change", saveSettings);
document.body.appendChild(settingsDiv);
