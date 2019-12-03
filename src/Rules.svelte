<script>
  export let lang;
  export let close;
  import { Swipe, SwipeItem } from "svelte-swipe";
</script>

<style>
  :root {
    --sv-swipe-panel-height: 60vh;
  }

  :global(.bg) {
    justify-content: normal !important;
  }

  :global(.swipeable-item) {
      padding: 10px 0;
  }

  :global(.dot) {
      transition: background-color 200ms;
  }

  .rules-wrapper {
    width: 100%;
  }

  p {
    line-height: 1.5rem;
  }
</style>

<div class="rules-wrapper">
  <Swipe showIndicators={true}>
    <SwipeItem>
      <h4>Game Rules</h4>
      <p>Kadosh is played with a single deck of cards.</p>
      <p>
        The goal of the game is to place all face-cards (K/Q/J) within the frame
        of the board:
      </p>
      <p>
        👑 Kings in the corners
        <br />
        👸 Queens in the top and bottom edges
        <br />
        🤴 Jacks in the right and left edges
      </p>
    </SwipeItem>
    <SwipeItem>
      <h4>Game Phases - Place Cards</h4>
      <p>
        In each turn, a card is drawn from the deck, and must be placed in an
        empty slot:
      </p>
      <p>Face-cards must be placed in one of their empty desegnated slots.</p>
      <p>Other cards can be placed in any of the empty slots.</p>
      <p>
        Keep going until you win, or until the board is full. If a face-card is
        drawn and it has no available slot, it's Game Over!
      </p>
    </SwipeItem>
    <SwipeItem>
      <h4>Game Phases - Remove 10s</h4>
      <p>Now that the board is full, it's time to make room for more cards.</p>
      <p>
        You can remove any 10s, or pairs of cards with the sum value of 10 (e.g
        9 + A)
      </p>
      <p>
        Keep going until there are no more cards to remove, then it's back to
        placing more cards.
      </p>
      <p>
        If the board is full and there are no cards to remove, it's Game Over!
      </p>
    </SwipeItem>
  </Swipe>
</div>
