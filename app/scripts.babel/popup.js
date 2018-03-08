'use strict';

document.querySelector('.markAll').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id,
      { file: './scripts/interact.js' }, function () {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'markAll' }, function (
          response
        ) {
          //   console.log(response.farewell);
        });
      });
  });
});


document.querySelector('.exportAll').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'exportAll' }, function (
      response
    ) {
      //   console.log(response.farewell);
    });
  });
});
