<script>
	let count = $state(0);

	$effect(() => {
		if (count >= 10) {
			alert(`count is dangerously high!`);
			count = 9;
		}
	});

	function handleClick() {
		count += 1;
	}
</script>

<button onclick={handleClick} class="btn btn-blue">
	Clicked {count}
	{count === 1 ? 'time' : 'times'}
</button>

<style lang="postcss">
	.btn {
		border: none;
		font-weight: var(--font-weight-6);
		padding-block: var(--size-2);
		padding-inline: var(--size-4);
		border-radius: var(--size-2);
	}
	.btn-blue {
		background: var(--blue-5);
		color: var(--gray-0);
	}
	.btn-blue:hover {
		background: var(--blue-7);
	}
</style>
