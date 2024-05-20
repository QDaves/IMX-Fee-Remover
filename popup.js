document.addEventListener('DOMContentLoaded', function () {
    const disableFeesCheckbox = document.getElementById('disable-fees');

    chrome.storage.sync.get(['disableFees'], function (data) {
        if (data.disableFees !== undefined) {
            disableFeesCheckbox.checked = data.disableFees;
            updateStatusIndicator(data.disableFees);
        }
        console.log('loaded settings:', data);
    });

    disableFeesCheckbox.addEventListener('change', function () {
        const disableFees = disableFeesCheckbox.checked;
        chrome.storage.sync.set({ disableFees: disableFees }, function () {
            console.log('Fees set to', disableFees);
            updateStatusIndicator(disableFees);
        });
    });

    function updateStatusIndicator(disableFees) {
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');

        if (disableFees) {
            statusIndicator.style.backgroundColor = '#2196F3';
            statusText.textContent = 'IMX Fees Disabled';
        } else {
            statusIndicator.style.backgroundColor = '#F44336';
            statusText.textContent = 'IMX Fees Active';
        }
    }
});