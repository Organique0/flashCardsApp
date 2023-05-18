import { useEffect, useState } from "react";
import "./styles/Style.css";
import { useParams } from "react-router-dom";
import { TDeck } from "./api/getDecks";
import { createCard } from "./api/createCard";
import { getDeck } from "./api/getDeck";
import { deleteCard } from "./api/deleteCard";

export default function Deck() {
  const [deck, setDeck] = useState<TDeck | undefined>(undefined);
  const [cards, setCards] = useState<string[]>([]);
  const [text, setText] = useState("");
  const { deckId } = useParams();

  async function handleCreateCard(e: React.FormEvent) {
    e.preventDefault();
    const { cards: serverCards } = await createCard(deckId!, text);
    setCards(serverCards);
    setText("");
  }

  async function handleDeleteCard(cardId: number) {
    if (!deckId) return;
    const newDeck = await deleteCard(deckId, cardId);
    setCards(newDeck.cards);
  }

  useEffect(() => {
    async function fetchDeck() {
      if (!deckId) return;
      const newDeck = await getDeck(deckId);
      setDeck(newDeck);
      setCards(newDeck.cards);
    }

    fetchDeck();
  }, [deckId]);

  return (
    <div className="App">
      <h1>{deck?.title}</h1>
      <ul className="decks">
        {cards.map((card, cardId) => (
          <li key={cardId}>
            <button onClick={() => handleDeleteCard(cardId)}>X</button>
            {card}
          </li>
        ))}
      </ul>
      <form onSubmit={handleCreateCard}>
        <label htmlFor="card-title">Card text</label>
        <input
          id="card-title"
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setText(e.target.value);
          }}
        />
        <button>Create Card</button>
      </form>
    </div>
  );
}
