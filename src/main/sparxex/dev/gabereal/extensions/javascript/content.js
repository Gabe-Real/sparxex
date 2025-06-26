// content.js
let startX, startY, endX, endY;
let selectionBox;

document.addEventListener("mousedown", (e) => {
  startX = e.clientX;
  startY = e.clientY;

  selectionBox = document.createElement("div");
  selectionBox.id = "selection-box";
  document.body.appendChild(selectionBox);
});

document.addEventListener("mousemove", (e) => {
  if (!selectionBox) return;

  endX = e.clientX;
  endY = e.clientY;

  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);

  selectionBox.style.cssText = `
    position: fixed;
    left: ${left}px;
    top: ${top}px;
    width: ${width}px;
    height: ${height}px;
    background-color: rgba(0, 0, 255, 0.3);
    border: 2px dashed blue;
    z-index: 999999;
  `;
});

document.addEventListener("mouseup", async () => {
  if (!selectionBox) return;

  const rect = selectionBox.getBoundingClientRect();
  document.body.removeChild(selectionBox);

  chrome.runtime.sendMessage({
    action: "capture_crop",
    rect: {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    }
  });

  selectionBox = null;
});
