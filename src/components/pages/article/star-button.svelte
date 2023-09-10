<button
  type="button"
  title="on star"
  disabled={disabled}
  class="button-star"
  on:click={onClickButton}>
  <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
    <defs>
      <linearGradient id="a" x1="20%" y1="0%" y2="100%">
        <stop offset="0%" stop-color="currentColor" class="step-1"/>
        <stop offset="50%" stop-color="currentColor" class="step-2"/>
        <stop offset="100%" stop-color="currentColor" class="step-3"/>
      </linearGradient>
    </defs>
    <g fill="none" fill-rule="evenodd">
      <path fill="url(#a)" fill-rule="nonzero" d="M18.5 33l-2.247-2.086C8.27 23.534 3 18.666 3 12.692 3 7.825 6.751 4 11.525 4c2.697 0 5.286 1.28 6.975 3.303C20.19 5.28 22.778 4 25.475 4 30.249 4 34 7.825 34 12.692c0 5.974-5.27 10.842-13.253 18.238L18.5 33z"/>
    </g>
  </svg>
  <em>{count}</em>
</button>

<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()
export let count = 0
export let disabled = false

function onClickButton()
{
  dispatch('click')
}
</script>

<style src="./star-button.scss" lang="scss"></style>
