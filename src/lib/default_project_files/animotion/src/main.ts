import Slides from './slides.svelte'
import '@styles/tailwind.css'
import { mount } from "svelte";

const app = mount(Slides, {
	target: document.getElementById('app'),
})

export default app
