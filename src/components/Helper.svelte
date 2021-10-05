<script>

	import { HELP_ICON } from '../lib/icons'

	export let title;
	export let text;
	export let marginRight = false;
	export let marginLeft = false;

</script>

<style>

	.helper {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.helper.mr {
		margin-right: 6px;
	}
	.helper.ml {
		margin-left: 6px;
	}

	:global(.helper svg) {
		width: 18px;
		fill: rgb(75,75,75);
	}

	.tooltip {
		text-align: left !important;
		min-width: 220px;
	    top:-20px;
	    left:50%;
	    transform:translate(-50%, -100%);
	    padding: 12px;
	    color:#444444;
	    background-color:#EEEEEE;
	    border-radius: var(--base-radius);
	    position:absolute;
	    z-index:99999999;
	    box-sizing:border-box;
	    visibility:hidden; 
	    opacity:0; 
	    transition: all 0.15s ease-out 0.15s;
	}

	.helper:hover .tooltip {
		visibility:visible; opacity:1;
	}

	.tooltip i {
		position:absolute;
	    top:100%;
	    left:50%;
	    margin-left:-12px;
	    width:24px;
	    height:12px;
	    overflow:hidden;
	}

	.tooltip i::after {
	    content:'';
	    position:absolute;
	    width: 12px;
	    height: 12px;
	    left: 50%;
	    transform: translate(-50%,-50%) rotate(45deg);
	    background-color:#EEEEEE;
	}

	.title {
		font-weight: 700;
	}

</style>

<div class:mr={marginRight} class:ml={marginLeft} class={`helper`}>
	{@html HELP_ICON}
	<div class='tooltip'>
		<div class='title'>{title}</div>
		<div class='body'>{text}</div>
		<i></i>
	</div>
</div>