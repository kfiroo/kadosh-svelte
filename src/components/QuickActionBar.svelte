<script>
  import Rules from "./Rules.svelte";
  import Stats from "./Stats.svelte";
  import LeaderBoard from "./LeaderBoard.svelte";

  import Icon from "./Icon.svelte";
  import HelpIcon from "./icons/HelpIcon.svelte";
  import TrophyIcon from "./icons/TrophyIcon.svelte";
  import CardsIcon from "./icons/CardsIcon.svelte";

  import { login } from "../stores/authStore.js";

  import { getContext } from "svelte";

  const { open } = getContext("simple-modal");

  const showRules = () => open(Rules);
  const showStats = () => open(Stats);

  const showLeaderBoard = () => open(LeaderBoard)
</script>

<div class="qab">
  <Icon Svg={TrophyIcon} on:click={showLeaderBoard} />
  <Icon Svg={CardsIcon} on:click={showStats} />
  <Icon Svg={HelpIcon} on:click={showRules} />
</div>

<style>
  .qab {
    position: fixed;
    z-index: 1;
    bottom: 20px;
    left: 20px;
    width: 2.1em;
    display: flex;
    flex-direction: column;
  }

  .qab > :global(*) {
    margin: 5px 0;
  }

  .qab :global(svg) {
    stroke: rgba(189, 255, 196, 0.4);
    cursor: pointer;
    transition: stroke 250ms;
    width: 100%;
  }

  .qab :global(.icon-svg.fill) {
    fill: rgba(189, 255, 196, 0.4);
    transition: fill 250ms;
  }

  @media (hover: hover) {
    .qab :global(svg:hover) {
      stroke: rgb(82, 201, 94);
    }

    .qab :global(.icon-svg.fill:hover) {
      fill: rgb(82, 201, 94);
    }
  }
</style>