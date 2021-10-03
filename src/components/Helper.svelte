<script>
	export let text;
	export let direction;
	export let type = 'default';
</script>

<style>

	.container {
		display: inline-block;
		margin: 0 6px;
	}

	.tooltip {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		background-color: var(--gray-lighter);
		border-radius: 50px;
		cursor: default;
		font-size: 12.5px;
		color: rgb(220,220,220);
		font-weight: 400;
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
	    font-size: 1rem;
	    background-color: var(--gray-dark);
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
	    transform: translate(-50%, 4px);
	}

	.top:after {
		width: 225px;
	}

	.top:before {
		border: 5px solid transparent;
		border-top-color: var(--gray-dark);
	}

	.top:hover:before, .top:hover:after {
		opacity: 1;
    	pointer-events: none;
    	transform: translate(-50%, 0);
	}

	.right:after {
		right: 0;
		margin-left: 10px;
		width: 175px;
	}
	.right:before {
		right: 5px;
		border: 5px solid transparent;
		border-right-color: var(--gray-dark);
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

<div class='container'>
	<div class:opening={type =='opening'} class:closing={type =='closing'} class={`tooltip ${direction}`} data-text={text}>
		{#if type !='opening' && type != 'closing'}?{/if}
	</div>
</div>