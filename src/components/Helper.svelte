<script>

	import { HELP_ICON } from '../lib/icons'

	export let text;
	export let direction;
	export let marginRight = false;
	export let marginLeft = false;
	export let type = 'default';

</script>

<style>

	.tooltip {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	.tooltip.mr {
		margin-right: 6px;
	}
	.tooltip.ml {
		margin-left: 6px;
	}

	:global(.tooltip svg) {
		width: 18px;
		fill: rgb(75,75,75);
	}

	.tooltip.opening, .tooltip.closing {
		width: 7px;
		height: 7px;
	}

	.tooltip.opening {
		background-color: var(--gray-light);
	}
	.tooltip.closing {
		background-color: var(--orange);
	}

	.tooltip:after {
		opacity: 0;
		pointer-events: none;
		transition: all 0.18s ease-out 0.18s;
		text-indent: 0;
	    font-size: inherit;
	    background-color: var(--less-black);
	    border: 1px solid var(--gray-lighter);
	    border-radius: 8px;
	    color: rgb(220,220,220);
	    content: attr(data-text);
	    padding: 14px;
	    position: absolute;
	    z-index: 999; 
	    margin-bottom: 10px; 
	    word-break: break-word;
	    white-space: pre-line;
	    line-height: 1.3;
	    text-align: left !important;
	}

	.tooltip:before {
	    width: 0;
	    height: 0;
	    opacity: 0;
	    pointer-events: none;
	    transition: all 0.15s ease-out 0.15s;
	    content: "";
	    position: absolute;
	    z-index: 999; 
	}

	.top:after, .top:before {
		left: 50%;
		bottom: 100%;
	    transform-origin: top;
	    transform: translate(-50%, 0);
	}

	.top:after {
		width: 225px;
	}

	.top:before {
		border: 5px solid transparent;
		border-top-color: var(--gray-lighter);
	}

	.top:hover:before, .top:hover:after {
		opacity: 1;
    	pointer-events: none;
	}

	.right:after {
		right: 0;
		margin-left: 10px;
		width: 175px;
	}
	.right:before {
		right: 5px;
		border: 5px solid transparent;
		border-right-color: var(--gray-lighter);
	}
	.right:after, .right:before {
		left: 100%;
		top: 50%;
		transform: translate(calc(4px * -1), -50%);
	}
	.right.opening:after, .right.closing:after {
		top: -10px;
	}

	.right:hover:before, .right:hover:after {
		opacity: 1;
		pointer-events: none;
		transform: translate(0, -50%);
	}

	

</style>

<div class:opening={type =='opening'} class:closing={type =='closing'} class:mr={marginRight} class:ml={marginLeft} class={`tooltip ${direction}`} data-text={text}>
	{#if type !='opening' && type != 'closing'}{@html HELP_ICON}{/if}
</div>