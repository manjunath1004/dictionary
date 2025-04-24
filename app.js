document.getElementById("searchBtn").addEventListener("click", handleSearch);
document.getElementById("wordInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    handleSearch();
  }
});

async function handleSearch() {
  const word = document.getElementById("wordInput").value.trim();
  const resultDiv = document.getElementById("result");

  if (word === "") {
    resultDiv.innerHTML = `<p>Please enter a word!</p>`;
    return;
  }

  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Word not found");
    const data = await response.json();
    const entry = data[0];

    const wordName = entry.word;
    const partOfSpeech = entry.meanings[0].partOfSpeech;
    const pronunciation = entry.phonetic || entry.phonetics[0]?.text || "N/A";
    const audio = entry.phonetics.find(p => p.audio)?.audio || null;

    // Limit the number of definitions to 1 or 2
    let definitionsHTML = "";
    let meaningHTML = "";

    // Add up to two definitions
    entry.meanings.slice(0, 2).forEach(meaning => {
      meaning.definitions.slice(0, 1).forEach(def => {  // Only show 1 definition
        definitionsHTML += `
          <p><strong>Definition:</strong> ${def.definition}</p>
          ${def.example ? `<p><strong>Example:</strong> ${def.example}</p>` : ""}
          <hr>
        `;
      });
    });

    // Collect meaning and pronunciation
    meaningHTML = `
      <h2>${wordName}</h2>
      <p><strong>Part of speech:</strong> ${partOfSpeech}</p>
      <p><strong>Pronunciation:</strong> ${pronunciation}</p>
      ${audio ? `<button onclick="playAudio('${audio}')">🔊 Play Audio</button>` : ""}
    `;

    resultDiv.innerHTML = `
      ${meaningHTML}
      ${definitionsHTML}
    `;
  } catch (error) {
    resultDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
  }
}

function playAudio(url) {
  const audio = new Audio(url);
  audio.play();
}

// Dark Mode Toggle
document.getElementById("toggleMode").addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    document.getElementById("toggleMode").textContent = "🌙 Dark Mode";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    document.getElementById("toggleMode").textContent = "🌞 Light Mode";
  }
});
