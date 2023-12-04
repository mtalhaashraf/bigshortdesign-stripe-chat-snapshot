<script>
	export let title;
	export let hidden;
	export let enableClose = true;

	const handleClose = () => {
		hidden = true;
	};
</script>

<div
	style="background-color: rgba(0,0,0,0.7)"
	class:hidden
	class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full h-full md:inset-0 h-modal md:h-full"
>
	<div
		class=" bg-current flex flex-col justify-self-auto mt-20 p-4 mx-auto w-full max-w-2xl h-full md:h-auto"
	>
		<!-- Modal content -->
		<div class="relative shadow dark:bg-gray-700">
			<!-- Modal header -->
			<div class="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
				<h3 class="text-xl text-black font-semibol">
					{title || ''}
				</h3>
				{#if enableClose}
					<button
						on:click={handleClose}
						type="button"
						class=" text-black rounded-sm border-black border-1 text-sm p-1.5 ml-auto inline-flex items-center"
						data-modal-toggle="defaultModal"
					>
						<i class="fa fa-window-close" aria-hidden="true" />
						X
						<!-- <svg
							class="w-5 h-5"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
							style="color: black;"
							><path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/></svg
						> -->
					</button>
				{/if}
			</div>
			<div class="flex flex-col p-4 items-center justify-center">
				<!-- Modal body -->
				<slot />
			</div>
		</div>
	</div>
</div>
