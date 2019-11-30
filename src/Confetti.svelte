<script>
    import _ from 'lodash'
	export let amount = 0

    import { onMount } from 'svelte';

	const colors = ['#5FC9F5', '#FAA040', '#E94A3F']
	const maxSize = 16
	const minSize = 8

    let confetti = _.times(amount, id => {
        const width = _.random(minSize, maxSize)
        const height = width * 0.4
        return {
            id,
            width: width + 'px',
            height: height + 'px',
            'background-color': colors[Math.floor(Math.random() * 3)],
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            opacity: Math.random() + 0.5,
            transform: 'rotate(' + Math.random() * 360 + 'deg)',
            dx: _.random(-0.1, 0.1),
            dy: _.random(-0.1, 0.1),
        }
    })

    const getStyle = c => _.reduce(c, (s, v, k) => k === 'id' || k === 'dx' || k === 'dy' ? s : `${s} ${k}: ${v};`, '')

	onMount(() => {
		let frame;

		const d = 12 * 1000
        const dy = 1 / d * 16 * 100

        function move(c) {
            const top = parseFloat(c.top) + dy + c.dy
            const left = parseFloat(c.left) + c.dx
            const rotate = parseFloat(c.transform.replace('rotate(', '')) + c.dx * 5
            return {
                ...c,
                top: (top > 100 ? 0 : top) + '%',
                left: (left > 100 ? 0 : left < 0 ? 100 : left) + '%',
                transform: 'rotate(' + rotate + 'deg)'
            }
        }

		function loop() {
			frame = requestAnimationFrame(loop)
			confetti = confetti.map(move)
		}

		loop()

		return () => cancelAnimationFrame(frame);
	})
</script>

<style>
	.confetti-container {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        pointer-events: none;
	}
	.confetto {
	    position: absolute;
	}
</style>

<div class="confetti-container">
    {#each confetti as c (c.id)}
    	<div class="confetto"
    	    style={getStyle(c)}>
        </div>
    {/each}
</div>