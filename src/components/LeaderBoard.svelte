<script>
  import { stats } from "../stores/statsStore";
  import { login, user } from "../stores/authStore";

  if (!$user) {
    login();
  }

  const displayName = name => {
    const split = name.split(" ");
    return split.length > 1 ? `${split[0]} ${split[1][0]}.` : name;
  };
</script>

<style>
  h2 {
    font-size: 1.4em;
    text-align: center;
    margin-top: 0;
  }

  ul {
    list-style: none;
    padding: 0;
  }
  li {
    display: flex;
    padding: 4px 30px 4px 4px;
    border-radius: 10px;
    line-height: 24px;
  }

  li.highlight {
    background: lightblue;
  }

  li > * {
    margin-right: 10px;
  }

  .display-name {
    flex: 1;
  }

  img {
    border-radius: 50%;
    width: 24px;
    height: 24px;
  }
</style>

{#if $user && $stats}
  <h2>👑 Leader Board 👑</h2>
  <ul>
    {#each $stats as stat, i (stat.uid)}
      <li class:highlight={stat.uid === $user}>
        <span>{i + 1}.</span>
        <img src={stat.photoUrl} alt={displayName(stat.displayName)} />
        <span class="display-name">{displayName(stat.displayName)}</span>
        <span class="numbers">{stat.gamesWon} | {stat.gamesPlayed}</span>
      </li>
    {/each}
  </ul>
{/if}
