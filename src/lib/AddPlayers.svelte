<script lang="ts">
  import { onMount } from 'svelte';
  import { allPlayers } from '$lib';

  onMount(async () => {
      try {
          const response = await fetch('/api/load-player-json');
          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }
          $allPlayers = await response.json();
      } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
      }
  });

  $: playerList = $allPlayers;
</script>

{#if playerList.length > 0}
  <ul>
      {#each playerList as item, index (index)} <!-- Use index as the key -->
          <li>{item}</li> <!-- Directly display the item as it is a string -->
      {/each}
  </ul>
{:else}
  <p>Loading...</p>
{/if}

<style>
  /* Add your styles here */
</style>
