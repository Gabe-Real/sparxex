// -- App menu switching --
document.addEventListener('DOMContentLoaded', function () {
  const menuItems = document.querySelectorAll('.app-icon');
  const views = document.querySelectorAll('.app-view');
  let currentlyActive = null;

  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const appKey = item.getAttribute('data-app');
      const view = document.getElementById(`view-${appKey}`);

      if (currentlyActive === item) {
        menuItems.forEach(i => i.classList.remove('selected'));
        views.forEach(v => v.classList.remove('active'));
        currentlyActive = null;
      } else {
        menuItems.forEach(i => i.classList.remove('selected'));
        views.forEach(v => v.classList.remove('active'));
        item.classList.add('selected');
        view.classList.add('active');
        currentlyActive = item;
      }
    });
  });

  // Show first app by default
  if (menuItems.length) {
    menuItems[0].click();
  }

  // -- Move your AI logic here --
  document.getElementById("ask-ai")?.addEventListener("click", async () => {
    const question = document.getElementById("question").value;
    const context = document.getElementById("ocr-output").value;
    // Optionally: Clear previous answer or show 'Loading...'
    const answerBox = document.getElementById("answer");
    answerBox.innerText = 'Loading...';

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
    console.log(data);
    // Make sure 'data.choices' exists
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      answerBox.innerText = data.choices[0].message.content.trim();
    } else {
      answerBox.innerText = 'No answer returned. Please try again.';
    }
  });
});
