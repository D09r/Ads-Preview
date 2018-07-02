chrome.browserAction.onClicked.addListener(function(activeTab){
  var newURL = "AdsPreview.html";
  chrome.tabs.create({ url: newURL });
});