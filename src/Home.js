import { useState } from "react";
import { useEffect } from "react";
import logo0 from "./images/logo0.png";
import logo1 from "./images/logo1.png";
import logo2 from "./images/logo2.png";
import logo3 from "./images/logo3.png";
import logo4 from "./images/logo4.png";
import logo5 from "./images/logo5.png";
import logo6 from "./images/logo6.png";
import logo7 from "./images/logo7.png";
import logo8 from "./images/logo8.png";
import logo9 from "./images/logo9.png";
import logo10 from "./images/logo10.png";
import SubmitWord from "./SubmitWord";

const Home = () => {
  const url = "https://api.jsonbin.io/v3/b/63fe6dbcebd26539d08711f8";
  const xMasterKey =
    "$2b$10$uFqgtUlSDPdjk3yTIcmUxO5ewwlcDhpOQnOJ6ygTI7.ah/Xbgrdba";
  const logos = [
    logo0,
    logo1,
    logo2,
    logo3,
    logo4,
    logo5,
    logo6,
    logo7,
    logo8,
    logo9,
    logo10,
  ];
  const keyboard = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  const [inputValue, setInputValue] = useState("");
  const [password, setPassword] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([" "]);
  const [numberOfTries, setNumberOfTries] = useState(0);
  const [numberOfErrors, setNumberOfErrors] = useState(0);
  const [gameOutcome, setGameOutcome] = useState(0); //(0-welcomescreen;10-definition(single);1-definition(multi);2-guessing;3-won;4-lost;5-submitting words)
  const [wordDatabase, setWordDatabase] = useState(null);
  //const [availableCategories, setAvailableCategories] = useState([]);
  let visibleLetters = [];

  const handleChange = (e) => {
    setInputValue(e.toLowerCase());
  };

  // useEffect(() => {
  //   fetch("http://localhost:8000/words")
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => setWordDatabase(data))
  //     .then(console.log("data fetched"))
  //     .catch((error) => console.log("Could not fetch the data - " + error));
  // }, [gameOutcome]);

  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: {
        "X-Master-Key": xMasterKey,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setWordDatabase(data.record.words);
        //console.log(data.record.words);
      })
      .catch((error) => console.log("Could not fetch the data - " + error));
  }, [gameOutcome]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.length >= 1) {
      setPassword(inputValue);
      console.log(password);
      setGameOutcome(2);
    }
  };

  const handleGenerateWord = (category) => {
    let word = wordDatabase.filter((data) => data.category === category);
    let password = word[Math.floor(Math.random() * word.length)];
    console.log(password);
    setPassword(password.word);
    setGameOutcome(2);
  };

  const handleReset = () => {
    setPassword("");
    setInputValue("");
    setGuessedLetters([" "]);
    setNumberOfTries(0);
    setGameOutcome(0);
    setNumberOfErrors(0);
  };

  for (let i = 0; i < password.length; i++) {
    if (guessedLetters.includes(password[i])) {
      visibleLetters[i] = { letter: password[i], key: i };
    } else {
      visibleLetters[i] = { letter: "_", key: i };
    }
  }

  const handleKeyboard = (letter) => {
    setGuessedLetters((guessedLetters) => [...guessedLetters, letter]);

    if (!visibleLetters.some((character) => character.letter.includes("_"))) {
      setGameOutcome(3);
    }

    setNumberOfTries(numberOfTries + 1);
    if (!password.includes(letter)) {
      setNumberOfErrors(numberOfErrors + 1);
    }
    if (numberOfErrors > 9) {
      setGameOutcome(4);
    }
  };

  if (gameOutcome === 0) {
    return (
      <div className="button-container">
        <button onClick={() => setGameOutcome(10)}>Singleplayer</button>
        <button onClick={() => setGameOutcome(1)}>Multiplayer</button>
        <button onClick={() => setGameOutcome(5)}>Submit new words</button>
      </div>
    );
  } else if (gameOutcome === 1) {
    return (
      <div>
        <button onClick={() => setGameOutcome(0)}>Back</button>
        <br />
        <br />
        <form onSubmit={(e) => handleSubmit(e)}>
          <label>Set the word:</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
          />
          <button type="submit">Submit!</button>
        </form>
      </div>
    );
  } else if (gameOutcome === 10 && wordDatabase) {
    let uniqueCategories = [
      ...new Set(wordDatabase.map((item) => item.category)),
    ];
    return (
      <div>
        <button onClick={() => setGameOutcome(0)}>Back</button>
        <br />
        <p>Select category:</p>
        {wordDatabase && (
          <select
            onChange={(e) => [
              console.log("category choosen"),
              handleGenerateWord(e.target.value),
            ]}
          >
            <option>-</option>
            {uniqueCategories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  } else if (gameOutcome === 2) {
    if (
      visibleLetters.some((character) => character.letter.includes("_")) ===
      false
    ) {
      setGameOutcome(3);
    }
    return (
      <div className="game-container">
        <div className="characters-container">
          {keyboard.map(
            (letter) =>
              guessedLetters.includes(letter) === false && (
                <button
                  key={letter}
                  value={letter}
                  onClick={(e) => handleKeyboard(e.target.value)}
                >
                  {letter}
                </button>
              )
          )}
        </div>
        {numberOfErrors === 10 && <p>Game Over!</p>}
        <button onClick={handleReset}>Reset Game!</button>
        {numberOfErrors < 10 && (
          <p className="errors-counter">
            Number of errors left: {9 - numberOfErrors}
          </p>
        )}
        <div className="letters-container">
          {visibleLetters.map((character) => (
            <h1 key={character.key}>{character.letter}</h1>
          ))}
        </div>
        <img alt="hangman" src={logos[numberOfErrors]} />
      </div>
    );
  } else if (gameOutcome === 3) {
    return (
      <div>
        <button onClick={handleReset}>Reset Game!</button>
        <h2>The answer is: {password}</h2>
        <h1>You Win!</h1>
      </div>
    );
  } else if (gameOutcome === 4) {
    return (
      <div>
        <button onClick={handleReset}>Reset Game!</button>
        <h2>The answer was: {password}</h2>
        <h1>You Hang!</h1>
      </div>
    );
  } else if (gameOutcome === 5) {
    return (
      <>
        <button onClick={() => setGameOutcome(0)}>Back</button>
        <br />
        <br />
        {wordDatabase && (
          <SubmitWord
            url={url}
            xMasterKey={xMasterKey}
            wordDatabase={wordDatabase}
            setWordDatabase={setWordDatabase}
          />
        )}
      </>
    );
  } else
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
};
export default Home;
