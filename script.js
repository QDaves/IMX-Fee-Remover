function initializeRules(disableFees = true) {
    chrome.storage.sync.set({ disableFees }, () => {
        updateRules(disableFees);
    });
}

function updateRules(disableFees) {
    const rules = disableFees ? [{
        id: 1,
        priority: 1,
        action: {
            type: "redirect",
            redirect: {
                transform: {
                    queryTransform: {
                        removeParams: ["fee_recipients", "fee_percentages"]
                    }
                }
            }
        },
        condition: {
            urlFilter: "*://link.x.immutable.com/*",
            resourceTypes: ["main_frame", "sub_frame", "xmlhttprequest"]
        }
    }] : [];

    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules,
        removeRuleIds: [1]
    }, () => {
        if (chrome.runtime.lastError) {
            console.error('error updating rules:', chrome.runtime.lastError);
        } else {
            console.log('rules updated:', rules);
        }
    });
}

chrome.runtime.onInstalled.addListener(() => {
    initializeRules();
});

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.sync.get('disableFees', data => {
        console.log('Loading settings from storage:', data);
        updateRules(data.disableFees);
    });
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.disableFees) {
        updateRules(changes.disableFees.newValue);
    }
});