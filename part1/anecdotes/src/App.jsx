import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const random = (max) => Math.floor(Math.random() * max);
  const [selected, setSelected] = useState(() => random(anecdotes.length));

  const nextAnectod = () => {
    let newSelected;
    do {
      newSelected = random(anecdotes.length);
    } while (newSelected === selected);
    setSelected(newSelected);
  };

  const points = [0, 0, 0, 0, 0, 0, 0, 0];

  const [vote, setVote] = useState([...points]);

  const onVote = () => {
    const copy = [...vote];
    copy[selected] += 1;
    setVote(copy);
  };

  const mostVoteIndex = () => {
    const maxVote = Math.max(...vote);
    return vote.findIndex((v) => v === maxVote);
  };

  return (
    <>
      <h1>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>has {vote[selected]} votes</div>
      <button onClick={onVote}>vote</button>
      <button onClick={nextAnectod}>next anectode</button>
      <h1>Anecdote with most votes</h1>
      <div>{anecdotes[mostVoteIndex()]}</div>
      <div>has {vote[mostVoteIndex()]} votes</div>
    </>
  );
};

export default App;
