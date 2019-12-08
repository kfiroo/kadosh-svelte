<script>
    import {countBy, sample, keyBy, mapValues} from 'lodash-es'
    import Card from './Card.svelte'
    import { deck } from '../stores/gameStores'

    const suits = ['spades', 'diamonds', 'clubs', 'hearts']
    const monkeys = ['🙈', '🙉', '🙊']

    const random = value => ({value, suit: sample(suits)})
    const NON_FACE_CARDS = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const FACE_CARDS = ['J', 'Q', 'K']

    $: remaining = countBy($deck, 'value')
    $: stats = mapValues(keyBy([...NON_FACE_CARDS, ...FACE_CARDS]), v => {
            const r = remaining[v] || 0
            const c = r && Math.round(r / $deck.length * 100)
            return r ? `${r} (${c}%)` : sample(monkeys)
        })
</script>

<style>
    .stats {
        display: grid;
        grid-gap: 10px;
        grid-template-rows: min-content min-content;
        grid-template-columns: 1fr;
    }
    .stats label {
        align-self: center;
        justify-self: center;
        font-size: 12px;
        white-space: nowrap;
    }
    .royals {
        display: grid;
        grid-gap: 5px;
        grid-template-rows: 20px 76px;
        grid-template-columns: repeat(3, 56px);
        justify-self: center;
    }
    .royals > :global(.card) {
        grid-row-start: 2;
        transform: scale(0.8);
        transform-origin: 0 0;
    }
    .numbers {
        display: grid;
        grid-gap: 5px;
        grid-template-rows: 20px 66px;
        grid-template-columns: repeat(5, 49px);
        justify-self: center;
    }
    .numbers > :global(.card) {
        grid-row-start: 2;
        transform: scale(0.7);
        transform-origin: 0 0;
    }
</style>

<div class="stats">
    <div class="royals">
        {#each FACE_CARDS as card (card)}
            <label>{stats[card]}</label>
            <Card showCard={true} card={random(card)} />
        {/each}
    </div>
    <div class="numbers">
        {#each NON_FACE_CARDS.slice(5) as card (card)}
            <label>{stats[card]}</label>
            <Card showCard={true} card={random(card)} />
        {/each}
    </div>
    <div class="numbers">
        {#each NON_FACE_CARDS.slice(0, 5) as card (card)}
            <label>{stats[card]}</label>
            <Card showCard={true} card={random(card)} />
        {/each}
    </div>
</div>
