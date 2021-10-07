<script>

	export let label;
	export let title;
	export let text;
	export let small = false;
	export let marginRight = false;
	export let marginLeft = false;

</script>

<style>

	.empty {
		color: var(--dim-gray);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.helper {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		cursor: default;
	}

	.helper.mr {
		margin-right: 6px;
	}
	.helper.ml {
		margin-left: 6px;
	}

	.label {
		border-bottom: 1px dashed var(--onyx);
		transition: all 0.15s ease-out 0.15s;
	}

	.helper:hover .label {
		border-color: var(--dim-gray);
	}

	.tooltip {
		text-align: left !important;
		min-width: 234px;
	    top: -14px;
	    left: 50%;
	    transform: translate(-50%, -100%);
	    padding: 14px;
	    border: 1px solid var(--onyx);
	    border-radius: var(--base-radius);
	    background-color: var(--eerie-black);
	    position: absolute;
	    z-index: 99999999;
	    box-sizing: border-box;
	    visibility: hidden; 
	    opacity: 0;
	    transition: all 0.15s ease-out 0.15s;
	}
	.tooltip.sm {
		min-width: 170px;
	}

	.helper:hover .tooltip {
		visibility: visible;
		opacity:1;
	}

	.tooltip i {
		position: absolute;
	    top: 100%;
	    left: 50%;
	    margin-left: -12px;
	    width: 24px;
	    height: 12px;
	    overflow: hidden;
	}

	.tooltip i::after {
	    content: '';
	    position: absolute;
	    width: 12px;
	    height: 12px;
	    left: 50%;
	    transform: translate(-50%,-50%) rotate(45deg);
	    background-color: var(--onyx);
	}

	.title {
		font-weight: 700;
		padding-bottom: 10px;
		margin-bottom: 10px;
		border-bottom: 1px solid var(--jet);
	}

	.body {
		line-height: 1.35;
	}

</style>

{#if label}
<div class:mr={marginRight} class:ml={marginLeft} class={`helper`}>
	<span class='label'>{label}</span>
	<div class={`tooltip ${small ? 'sm' : ''}`}>
		<div class='title'>{title}</div>
		<div class='body'>{text}</div>
		<i></i>
	</div>
</div>
{:else}
<div class='empty'>--</div>
{/if}