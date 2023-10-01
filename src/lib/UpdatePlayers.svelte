<script lang="ts">
  import { ListBox, ListBoxItem, getToastStore, popup } from '@skeletonlabs/skeleton';
  import type { PopupSettings, ToastSettings } from '@skeletonlabs/skeleton';
  import { allPlayers, currentPlayers, playerOne, playerTwo, playerThree, playerFour } from '$lib';
	import { onMount } from 'svelte';

  const toastStore = getToastStore();
	async function getCurrentNames(): Promise<void> {
		try {
			const response = await fetch('/api/get-obs-names');
			if (!response.ok) {
				throw new Error('Network response was not ok ' + response.statusText);
			}
			const UpdatedNames = await response.json();
			console.log("UpdatedNames", UpdatedNames);
			console.log("UpdatedNames.player1", UpdatedNames.player1);
			
			// Update the names
			$playerOne = UpdatedNames.player1
			$playerTwo = UpdatedNames.player2
			$playerThree = UpdatedNames.player3
			$playerFour = UpdatedNames.player4
      } catch (error) {
				const errorToast: ToastSettings = {message: "Error getting current names", background: "variant-filled-error", timeout: 5000 };
				toastStore.trigger(errorToast);
				console.error('There has been a problem with your fetch operation:', error);
		}
	}

	async function reloadNames(): Promise<void> {
		await getCurrentNames();
		newPlayerOne = "";
		newPlayerTwo = "";
		newPlayerThree = "";
		newPlayerFour = "";
		const successToast: ToastSettings = {message: "Names Reloaded", background: "variant-filled-success", timeout: 5000 };
		toastStore.trigger(successToast);
	}

	onMount(async () => {
		await getCurrentNames();
	})

  async function saveNewNames(): Promise<void> {
		const newNames = {
			player1: newPlayerOne,
			player2: newPlayerTwo,
			player3: newPlayerThree,
			player4: newPlayerFour
		}
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newNames)  // Adjusted destination
    }
    const response: Response = await fetch('/api/post-obs-names', request);
    const result: { success: boolean; message?: string } = await response.json();
		let toast: ToastSettings;
    if (!result.success) {
      toast = {
        message: result.message || 'Something went wrong!',
        background: 'variant-filled-error',
        timeout: 5000
      };
			await reloadNames()
    } else {
      toast = {
        message: result.message || 'Names Updated!',
        background: 'variant-filled-success',
        timeout: 5000
      };
    }
		toastStore.trigger(toast);
  }
	
	let newPlayerOne = "";
	let newPlayerTwo = "";
	let newPlayerThree = "";
	let newPlayerFour = "";

  const playerOneCombobox: PopupSettings = {
    event: 'focus-click',
    target: 'playerOneCombobox',
    placement: 'bottom',
    closeQuery: '.listbox-item'
  };

	const playerTwoCombobox: PopupSettings = {
		event: 'focus-click',
		target: 'playerTwoCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};

	const playerThreeCombobox: PopupSettings = {
		event: 'focus-click',
		target: 'playerThreeCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};
	
	const playerFourCombobox: PopupSettings = {
		event: 'focus-click',
		target: 'playerFourCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};

	const newName = {
		"yes": "btn variant-filled w-full justify-between",
		"no": "btn variant-ghost w-full justify-between"
	}
	$: classOne = newName[newPlayerOne && newPlayerOne != $playerOne ? "yes" : "no"];
	$: classTwo = newName[newPlayerTwo && newPlayerTwo != $playerTwo ? "yes" : "no"];
	$: classThree = newName[newPlayerThree && newPlayerThree != $playerThree ? "yes" : "no"];
	$: classFour = newName[newPlayerFour && newPlayerFour != $playerFour ? "yes" : "no"];

	// Change to $currentPlayers when AddPlayers is working
	$: playerList = $allPlayers;
</script>

<!-- Player One DropDown-->
<div class="card w-48 shadow-xl py-2" data-popup="playerOneCombobox">
	<ListBox rounded="rounded-none">
		{#each playerList as playerName }
			<ListBoxItem bind:group={newPlayerOne} name="player1" value={playerName}>{playerName}</ListBoxItem>    
		{/each}
	</ListBox>
	<div class="arrow bg-surface-100-800-token" />
</div>

<!-- Player Two DropDown-->
<div class="card w-48 shadow-xl py-2" data-popup="playerTwoCombobox">
	<ListBox rounded="rounded-none">
		{#each playerList as playerName }
			<ListBoxItem bind:group={newPlayerTwo} name="player2" value={playerName}>{playerName}</ListBoxItem>    
		{/each}
	</ListBox>
	<div class="arrow bg-surface-100-800-token" />
</div>

<!-- Player Three DropDown-->
<div class="card w-48 shadow-xl py-2" data-popup="playerThreeCombobox">
	<ListBox rounded="rounded-none">
		{#each playerList as playerName }
			<ListBoxItem bind:group={newPlayerThree} name="player3" value={playerName}>{playerName}</ListBoxItem>    
		{/each}
	</ListBox>
	<div class="arrow bg-surface-100-800-token" />
</div>

<!-- Player Four DropDown-->
<div class="card w-48 shadow-xl py-2" data-popup="playerFourCombobox">
	<ListBox rounded="rounded-none">
		{#each playerList as playerName }
			<ListBoxItem bind:group={newPlayerFour} name="player4" value={playerName}>{playerName}</ListBoxItem>    
		{/each}
	</ListBox>
	<div class="arrow bg-surface-100-800-token" />
</div>

<!-- Main Card -->
<div class="card variant-ghost-surface m-5">
	<header class="card-header flex h2">
		<span class="flex-grow text-center">Set Player Names</span>
		<span>
			<button type="button" on:click={reloadNames} class="btn variant-ringed-surface">
				<span>↻</span>
				<span>Reload</span>
			</button>
			<button type="button" on:click={saveNewNames} class="btn variant-filled-success">
				<span>💾</span>
				<span>Save</span>
			</button>
		</span>
	</header>
	<section class="flex flex-wrap justify-evenly">
		<!-- Player One -->
		<div class="card m-5 w-full sm:w-64 justify-center">
			<header class="card-header h3 flex-grow m-1 p-1 text-center">Player 1</header>
			<section class="flex-grow">
				<button use:popup={playerOneCombobox}
					class={classOne} >
					<span class="flex-grow text-center">{newPlayerOne != "" ? newPlayerOne : $playerOne}</span>
					<div>↓</div>
				</button>
			</section>
		</div>

		<!-- Player Two -->
		<div class="card m-5 w-full sm:w-64 justify-center">
			<header class="card-header h3 flex-grow m-1 p-1 text-center">Player 2</header>
			<section class="flex-grow">
				<button use:popup={playerTwoCombobox}
					class={classTwo} >
					<span class="flex-grow text-center">{newPlayerTwo != "" ? newPlayerTwo : $playerTwo}</span>
					<div>↓</div>
				</button>
			</section>
		</div>

		<!-- Player Three -->
		<div class="card m-5 w-full sm:w-64 justify-center">
			<header class="card-header h3 flex-grow m-1 p-1 text-center">Player 3</header>
			<section class="flex-grow">
				<button use:popup={playerThreeCombobox}
					class={classThree} >
					<span class="flex-grow text-center">{newPlayerThree != "" ? newPlayerThree : $playerThree}</span>
					<div>↓</div>
				</button>
			</section>
		</div>

		<!-- Player Four -->
		<div class="card m-5 w-full sm:w-64 justify-center">
			<header class="card-header h3 flex-grow m-1 p-1 text-center">Player 4</header>
			<section class="flex-grow">
				<button use:popup={playerFourCombobox}
					class={classFour} >
					<span class="flex-grow text-center">{newPlayerFour != "" ? newPlayerFour : $playerFour}</span>
					<div>↓</div>
				</button>
			</section>
		</div>
	</section>
</div>

