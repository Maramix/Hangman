import { useState } from "react";

const SubmitWord = ({ url, xMasterKey, wordDatabase, setWordDatabase }) => {
  const [category, setCategory] = useState("");
  const [word, setWord] = useState("");
  const [message, setMessage] = useState("");

  function handleAddWord(e) {
    e.preventDefault();
    const newDatabase = new Array(...wordDatabase, {
      category: category,
      word: word,
      id: wordDatabase.length + 1,
    });

    fetch(url, {
      method: "PUT",
      headers: {
        "X-Master-Key": xMasterKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({ words: newDatabase }),
    })
      .then((res) => {
        if (res.ok) {
          throw Error("new word added succesfully!");
        } else {
          console.log(res);
          throw Error("an error occured!");
        }
      })
      .catch((err) => setMessage(err.message));
    setWord("");
    setWordDatabase(newDatabase);
  }

  let uniqueCategories = [
    ...new Set(wordDatabase.map((item) => item.category)),
  ];

  return (
    <>
      <form onSubmit={(e) => handleAddWord(e)}>
        <label>Select the category:</label>
        <br />
        {wordDatabase && (
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option className="option"></option>
            {uniqueCategories.map((option) => (
              <option className="option" key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
        <div>
          <label>Set the word:</label>
          <br />
          <input
            type="text"
            required
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
        </div>
        <button>Submit!</button>
        {message && <p onMouseOver={() => setMessage("")}>{message}</p>}
      </form>
    </>
  );
};

export default SubmitWord;
