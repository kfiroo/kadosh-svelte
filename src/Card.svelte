<script>
	export let card
    export let showCard

    const cardWidth = 69
    const cardHeight = 94

    function cardValue(card) {
        if (card.value === 'A') {
            return 1
        }
        if (card.value === 'J') {
            return 11
        }
        if (card.value === 'Q') {
            return 12
        }
        if (card.value === 'K') {
            return 13
        }
        return parseInt(card.value, 10)
    }

    function calcBgPosition(c, show) {
	    if (!c) {
	        return '0px 0px'
	    }
	    if (!show) {
	        return '0px 0px'
	    }
        const offsets = { "c": 0, "d": 1, "h": 2, "s": 3 }
        const suit = c.suit.charAt(0).toLowerCase()
        const rank = cardValue(c)

        return `${-rank * cardWidth}px ${-offsets[suit] * cardHeight}px`
    }

	$: backgroundPosition = calcBgPosition(card, showCard)
</script>

<style>
	.card {
        background-image: url("http://einaregilsson.github.io/cards.js/img/cards.png");
        width: 69px;
        height: 94px;
	}
</style>

<div
    class="{card ? 'card ' + card.suit + '_' + card.value : ''}"
    style="background-position: {backgroundPosition}">
</div>