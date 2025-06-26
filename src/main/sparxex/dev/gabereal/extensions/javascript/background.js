chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "capture_crop") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = message.rect.width;
        canvas.height = message.rect.height;

        ctx.drawImage(
          img,
          message.rect.x, message.rect.y,
          message.rect.width, message.rect.height,
          0, 0,
          message.rect.width, message.rect.height
        );

        const croppedDataURL = canvas.toDataURL("image/png");

        chrome.runtime.sendMessage({ action: "run_ocr", dataUrl: croppedDataURL });
      };
    });
  }
});
