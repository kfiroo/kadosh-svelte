<script>
    import _ from 'lodash'
    import Card from './Card.svelte'

    export let deck

    const random = value => ({value, suit: _.sample(['spades', 'diamonds', 'clubs', 'hearts'])})

    $: remaining = _.countBy(deck, 'value')

    const stats = v => {
        const r = remaining[v]
        const c = Math.round(r / deck.length * 100)
        return `${r} (${c}%)`
    }
</script>

<style>
    .stats {
        width: 320px;
        margin: 30px auto;
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
        grid-template-columns: repeat(6, 49px);
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
        <label>{stats('J')}</label>
        <Card showCard={true} card={random('J')} />
        <label>{stats('Q')}</label>
        <Card showCard={true} card={random('Q')} />
        <label>{stats('K')}</label>
        <Card showCard={true} card={random('K')} />
    </div>
    <div class="numbers">
        <label>{stats('5')}</label>
        <Card showCard={true} card={random('5')} />
        <label>{stats('6')}</label>
        <Card showCard={true} card={random('6')} />
        <label>{stats('7')}</label>
        <Card showCard={true} card={random('7')} />
        <label>{stats('8')}</label>
        <Card showCard={true} card={random('8')} />
        <label>{stats('9')}</label>
        <Card showCard={true} card={random('9')} />
        <label>{stats('10')}</label>
        <Card showCard={true} card={random('10')} />
    </div>
</div>
