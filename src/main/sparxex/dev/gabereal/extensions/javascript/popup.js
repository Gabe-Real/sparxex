const worker = Tesseract.createWorker({
  workerPath: 'node_modules/tesseract/tesseract-core.worker.js',
  corePath: 'node_modules/tesseract.js-core/tesseract-core.wasm.js',
  wasmBinaryPath: 'node_modules/tesseract.js-core/tesseract-core.wasm',
});


// -- App menu switching --
document.addEventListener('DOMContentLoaded', function () {
  const menuItems = document.querySelectorAll('.app-icon');
  const views = document.querySelectorAll('.app-view');

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove selection from all icons & hide all views
      menuItems.forEach(i => i.classList.remove('selected'));
      views.forEach(v => v.classList.remove('active'));

      // Add .selected to clicked icon
      item.classList.add('selected');
      // Show matching app view
      const appKey = item.getAttribute('data-app');
      document.getElementById(`view-${appKey}`).classList.add('active');
    });
  });

  // Show first app by default
  if (menuItems.length) {
    menuItems[0].click();
  }
});

// -- Rest of your Sparx Reader logic stays as before, but only runs if its view is active --
document.getElementById("ask-ai")?.addEventListener("click", async () => {
  const question = document.getElementById("question").value;
  const context = document.getElementById("ocr-output").value;
  // Your existing AI code here...


  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-maverick:free",
      messages: [
        { role: "system", content: "Use this context to answer questions." },
        { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` }
      ]
    })
  });

  const data = await response.json();
  document.getElementById("answer").innerText = data.choices[0].message.content.trim();
});
