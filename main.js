function main() {
  // DARK MODE
  const toggleTheme = document.querySelector("#toggleTheme");
  const moon = document.querySelector("#moon").firstElementChild;
  toggleTheme.addEventListener("click", () => {
    const allText = document.querySelectorAll("span, h1, h2, h3, p, select");

    document.body.classList.toggle("dark");
    moon.classList.toggle("dark");
    Array.from(allText).forEach((text) => {
      text.classList.toggle("dark");
    });
  });
  // FONT CHANGE
  const selectFont = document.querySelector("#selectFont");
  selectFont.addEventListener("change", () => {
    const allText = document.querySelectorAll("span, h1, h2, h3, p, select");

    if (selectFont.value == "mono") {
      Array.from(allText).forEach((text) => {
        text.style.fontFamily = "Roboto Mono";
      });
    }
    if (selectFont.value == "serif") {
      Array.from(allText).forEach((text) => {
        text.style.fontFamily = "PT Serif";
      });
    }
    if (selectFont.value == "sansserif") {
      Array.from(allText).forEach((text) => {
        text.style.fontFamily = "Inter";
      });
    }
  });
  // FETCH
  const searchField = document.querySelector("#searchField");
  const search = document.querySelector("#search");
  const results = document.querySelector(".results");
  search.addEventListener("click", () => {
    fetchWord();
  });
  searchField.addEventListener("keyup", () => {
    if (event.key === "Enter") {
      fetchWord();
    }
  });
  async function fetchWord() {
    const word = searchField.value;

    const searchDictionary = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const fetchResults = await searchDictionary.json();
    const fResult = fetchResults[0];

    results.innerHTML = "";
    ///
    if (fResult === undefined) {
      const errorMessage = document.createElement("p");
      errorMessage.className = "errorMessage";
      errorMessage.textContent =
        "Sorry, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead.";
      results.appendChild(errorMessage);
    } else {
      // results header
      const resultsHeader = document.createElement("section");
      resultsHeader.className = "results__header";
      results.appendChild(resultsHeader);
      // header text
      const headerText = document.createElement("section");
      headerText.className = "header__text";
      resultsHeader.appendChild(headerText);
      // header text --  h1 & phonetics
      const h1 = document.createElement("h1");
      const phonetic = document.createElement("span");
      h1.textContent = fResult.word;
      phonetic.textContent = fResult.phonetic;
      if (moon.classList.contains("dark")) {
        h1.classList.add("dark");
      }
      headerText.append(h1, phonetic);
      // results body
      const resultsBody = document.createElement("section");
      resultsBody.className = "results__body";
      results.appendChild(resultsBody);
      // meanings -- part of sentence container
      fResult.meanings.forEach((meaning) => {
        const bodyPoS = document.createElement("section");
        bodyPoS.className = "body__partOfSentence";
        resultsBody.appendChild(bodyPoS);
        //   pos span
        const pOS = document.createElement("span");
        const hr = document.createElement("hr");
        pOS.className = "partOfSentence";
        pOS.textContent = meaning.partOfSpeech;
        bodyPoS.append(pOS, hr);
        //   body meaning
        const bodyMeaning = document.createElement("section");
        bodyMeaning.className = "body__meaning";
        resultsBody.appendChild(bodyMeaning);
        // meaning
        const meaningFixed = document.createElement("span");
        meaningFixed.className = "meaning";
        meaningFixed.textContent = "Meaning";
        bodyMeaning.appendChild(meaningFixed);
        //   ul
        const ul = document.createElement("ul");
        bodyMeaning.appendChild(ul);
        meaning.definitions.forEach((dfn, i) => {
          // li and spans
          const li = document.createElement("li");
          const lispan = document.createElement("span");
          lispan.className = meaning.partOfSpeech;
          lispan.textContent = dfn.definition;
          if (moon.classList.contains("dark")) {
            lispan.classList.add("dark");
          }
          li.appendChild(lispan);
          ul.appendChild(li);
        });
        //   synonyms body
        const bodySynonyms = document.createElement("section");
        bodySynonyms.className = "body__synonyms";
        const synonymsFixed = document.createElement("span");
        synonymsFixed.className = "synonyms";
        synonymsFixed.textContent = "Synonyms";
        bodySynonyms.appendChild(synonymsFixed);
        resultsBody.appendChild(bodySynonyms);
        //   synonyms
        if (meaning.synonyms.length < 1) {
          const noSynFound = document.createElement("span");
          noSynFound.textContent = "Nothing found...";
          noSynFound.className = "nosynonyms";
          bodySynonyms.appendChild(noSynFound);
        } else {
          const allSynonyms = document.createElement("ul");
          bodySynonyms.appendChild(allSynonyms);
          meaning.synonyms.forEach((syn) => {
            const synAnchor = document.createElement("span");
            synAnchor.textContent = syn;
            bodySynonyms.appendChild(synAnchor);
          });
        }
      });
    }
  }
}

main();
