<script lang="ts">
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
	import UpdatePlayers from "$lib/UpdatePlayers.svelte";
	import AddPlayers from '$lib/AddPlayers.svelte';

	let tabSet: number = 0;
</script>
<TabGroup justify="justify-center">
	<Tab bind:group={tabSet} name="playerlist" value={0}>Player List</Tab>
	<Tab bind:group={tabSet} name="currentplayers" value={1}>Current Players</Tab>
	<Tab bind:group={tabSet} name="obsscenes" value={2}>OBS Scenes</Tab>
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
			<AddPlayers />
		{:else if tabSet === 1}
			<UpdatePlayers />
		{:else if tabSet === 2}
			(OBS Scenes)
		{/if}
	</svelte:fragment>
</TabGroup>


