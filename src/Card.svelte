<script context="module">
    import { quintOut } from 'svelte/easing'
    import { crossfade } from 'svelte/transition'

    const [send, receive] = crossfade({
        duration: d => Math.sqrt(d * 200),

        fallback(node, params) {
            const style = getComputedStyle(node)
            const transform = style.transform === 'none' ? '' : style.transform

            return {
                duration: 600,
                easing: quintOut,
                css: t => `
                    transform: ${transform} scale(${t})
                    opacity: ${t}
                `
            }
        }
    })
</script>

<script>
	export let card

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

    function calcBgPosition(c) {
	    if (!c) {
	        return ''
	    }
        const offsets = { "c": 0, "d": 1, "h": 2, "s": 3 }
        const suit = c.suit.charAt(0).toLowerCase()
        const rank = cardValue(c)

        return `${-rank * cardWidth}px ${-offsets[suit] * cardHeight}px`
    }

	$: backgroundPosition = calcBgPosition(card)
</script>

<style>
	.card {
        background-image: url("http://einaregilsson.github.io/cards.js/img/cards.png");
        position: absolute;
        cursor:pointer;
        width: 69px;
        height: 94px;
	}
</style>

<div
    class="{card ? 'card' : ''}"
    style="background-position: {backgroundPosition}"
    in:receive="{{key: [card.suit, card.value].join('_')}}"
    out:send="{{key: [card.suit, card.value].join('_')}}">
</div>