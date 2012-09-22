chrome.downloads.onChanged.addListener(function(downloadDelta) {
  if(downloadDelta.state && downloadDelta.state.current == "complete") {
    console.log(downloadDelta);
    alert("Download completed!\n" + downloadDelta.filename.current);
  }
});
