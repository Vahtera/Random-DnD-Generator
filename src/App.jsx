import React, { useState, useEffect, useRef } from "react";
import { loadWords, pickRandomWord } from "libAnna"; // Importing from the npm module
import "./App.css";

function App() {
    const [wizards, setWizards] = useState([]);
    const [mages, setMages] = useState([]);
    const [magicwords, setMagicWords] = useState([]);
    const [englishverbs, setEnglishVerbs] = useState([]);
    const [englishverbsing, setEnglishVerbsIng] = useState([]);
    const [englishverbspast, setEnglishVerbsPast] = useState([]);
    const [englishnouns, setEnglishNouns] = useState([]);
    const [englishnounsFverbs, setEnglishNounsFVerbs] = useState([]);
    const [englishadj, setEnglishAdjectives] = useState([]);
    const [selectedPhrases, setSelectedPhrases] = useState([]);

    const listRef = useRef(null);

    useEffect(() => {
        loadWords("wizardnames.txt", setWizards);
        loadWords("mages.txt", setMages);
        loadWords("magicwords.txt", setMagicWords);
        loadWords("english_verbs.txt", setEnglishVerbs);
        loadWords("english_verbs_ing.txt", setEnglishVerbsIng);
        loadWords("english_verbs_past.txt", setEnglishVerbsPast);
        loadWords("english_nouns.txt", setEnglishNouns);
        loadWords("english_nouns_from_verbs.txt", setEnglishNounsFVerbs);
        loadWords("english_adjectives.txt", setEnglishAdjectives);
    }, []);

    const getRandomPhrase = () => {
        const styles = [
            () => `${capitalize(pickRandomWord(wizards))}'s ${capitalize(pickRandomWord(englishnouns))} of ${capitalize(pickRandomWord(englishverbsing))}`,
            () => `${capitalize(pickRandomWord(wizards))}'s ${capitalize(pickRandomWord(englishadj))} ${capitalize(pickRandomWord(englishnouns))}`,
            () => `${capitalize(pickRandomWord(magicwords))} ${capitalize(pickRandomWord(englishnouns))}`,
            () => `${capitalize(pickRandomWord(mages))} ${capitalize(pickRandomWord(englishnouns))}`,
            () => `${capitalize(pickRandomWord(englishverbsing))} ${capitalize(makePlural(pickRandomWord(englishnouns)))}`,
            () => `${capitalize(pickRandomWord(englishverbs))} ${capitalize(makePlural(pickRandomWord(englishnouns)))}`,
            () => `${capitalize(pickRandomWord(englishnouns))}`,
            () => `${capitalize(pickRandomWord(englishverbs))}`,
            () => `Transmute ${capitalize(pickRandomWord(englishnouns))} to ${capitalize(pickRandomWord(englishnouns))}`,
            () => `${capitalize(pickRandomWord(englishnouns))} of ${capitalize(pickRandomWord(englishnounsFverbs))}`,
            () => `${capitalize(pickRandomWord(englishverbsing))}`,
            () => `Protection from ${capitalize(makePlural(pickRandomWord(englishnouns)))}`,
            () => `Summon ${capitalize(pickRandomWord(englishnouns))}`,
            () => `Finger of ${capitalize(pickRandomWord(englishverbs))}`,
            () => `Power Word: ${capitalize(pickRandomWord(englishverbs))}`,
            () => `${capitalize(pickRandomWord(englishnouns))} ${capitalize(pickRandomWord(englishnouns))}`
        ];

        const randomStyle = Math.floor(Math.random() * styles.length);
        return styles[randomStyle]();
    };

    const handlePickWord = () => {
        const newPhrase = getRandomPhrase();
        setSelectedPhrases([...selectedPhrases, newPhrase]);
    };

    const handleSaveToFile = () => {
        const blob = new Blob([selectedPhrases.join("\n")], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "random_phrases.txt";
        link.click();
    };

    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => alert(`Copied: ${text}`))
            .catch(err => console.error("Failed to copy: ", err));
    };

    const handleClearList = () => {
        setSelectedPhrases([]);
    };

    const capitalize = (word) => {
        if (!word || typeof word !== "string") return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
    };

    const makePlural = (noun) => {
        if (!noun || typeof noun !== "string") return noun;
        const lastChar = noun.slice(-1);
        const secondLastChar = noun.slice(-2, -1);
        const consonants = "bcdfghjklmnpqrstvwxyz".split("");

        if (lastChar === "s" || lastChar === "x" || lastChar === "h") {
            return noun;
        } else if (lastChar === "y" && consonants.includes(secondLastChar)) {
            return noun.slice(0, -1) + "ies";
        } else if (lastChar === "f") {
            return noun.slice(0, -1) + "ves";
        } else if (secondLastChar === "f" && lastChar === "e") {
            return noun.slice(0, -2) + "ves";
        } else {
            return noun + "s";
        }
    };

    useEffect(() => {
        console.log("Scrolling effect triggered:", listRef.current);
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [selectedPhrases]);

    return (
        <div className="app-container">
            <h2 className="header">Random DnD Generator</h2>
            <button className="generate-button" onClick={handlePickWord}>
                Generate Random Thing
            </button>
            <div className="list-container" ref={listRef}>
                {selectedPhrases.map((phrase, index) => (
                    <div key={index} className="list-item" onClick={() => handleCopyToClipboard(phrase)}>
                        {phrase}
                    </div>
                ))}
            </div>
            <div className="button-container">
                <button className="action-button" onClick={handleSaveToFile}>Save</button>
                <button className="action-button" onClick={() => setSelectedPhrases([])}>Clear</button>
            </div>
        </div>
    );
}

export default App;
