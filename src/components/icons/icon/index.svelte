<svg
  width="24"
  height="24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={[
    'icon',
    `icon--${name}`,
    rotate && 'icon--rotate',
  ].filter(Boolean).join(' ')}>
  <use href={`${FeatherIcon}#${name}`}/>
</svg>

<script>
import FeatherIcon from './feather-sprite.svg'

export let name
export let rotate = false
</script>

<style lang="scss">
.icon {
  display: block;
  margin: var(--icon-margin, 0);
  color: var(--icon-color, var(--color-text));
  width: var(--icon-size, 24px);
  height: var(--icon-size, 24px);
  stroke-width: var(--icon-stroke, 2);
  animation: var(--icon-animation, none);
  transition: var(--icon-transition, none);
  &--rotate {
    --icon-animation: icon-spin 2s linear infinite;
  }
}
@keyframes -global-icon-spin {
  100% {
    rotate: 360deg;
  }
}
</style>
