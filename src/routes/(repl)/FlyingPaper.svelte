<svg viewBox="0 0 500 210" xmlns="http://www.w3.org/2000/svg">
	<rect class="paper" x="0" y="60" width="70" height="90" />
</svg>

<style>
	svg {
		width: 100%;
	}
	.paper {
		animation: move 2.5s infinite linear;
		transform-box: fill-box;
		transform-origin: center;
		stroke: black;
		fill: white;
		backface-visibility: visible;
	}

	@keyframes move {
		from {
			transform: perspective(1000px) translateX(0) translateY(0) rotateY(0.5turn) rotateX(1.5turn)
				scale(0.1);
		}
		50% {
			transform: perspective(1000px) translateX(215px) translateY(-50px) rotateY(0.7turn)
				rotateX(0.5turn) scale(1);
		}
		to {
			transform: perspective(1000px) translateX(430px) translateY(0) rotateY(0) rotateX(0)
				scale(0.1);
		}
	}
</style>
