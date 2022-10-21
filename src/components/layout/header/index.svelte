<header class="layout-header">
  <div class="layout-header__wrap">
    <h1 class="layout-header__logo">
      <a href="/" on:click={onClickLink}>
        <img src="/images/ico-logo.png" alt="redgoose"/>
      </a>
    </h1>
    <nav class="layout-header__buttons">
      <button
        type="button"
        title="toggle menu"
        class="navigation"
        class:on={activeNavigation}
        on:click|stopPropagation={onClickNavigationToggle}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" fill-rule="nonzero" d="M3 18h18v-2H3v2zm0-5h10v-2H3v2zm0-7v2h14V6H3z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </nav>
    <nav
      class="header-navigation"
      class:on={activeNavigation}
      aria-hidden="true"
      on:click|stopPropagation={() => {}}>
      <ul>
        <li>
          <a href="/nest/visual/" use:active on:click={onClickLink}>
            Works
          </a>
          <div>
            <ol>
              <li>
                <a href="/nest/visual/" use:active on:click={onClickLink}>
                  Visual
                </a>
              </li>
              <li>
                <a href="/nest/tool/" use:active on:click={onClickLink}>
                  Tool & Service
                </a>
              </li>
            </ol>
          </div>
        </li>
        <li>
          <a href="/nest/landscape/" use:active on:click={onClickLink}>
            Photography
          </a>
          <div>
            <ol>
              <li>
                <a href="/nest/landscape/" use:active on:click={onClickLink}>
                  Landscape
                </a>
              </li>
              <li>
                <a href="/nest/portrait/" use:active on:click={onClickLink}>
                  Portrait
                </a>
              </li>
              <li>
                <a href="/nest/snap/" use:active on:click={onClickLink}>
                  Snap
                </a>
              </li>
              <li>
                <a href="/nest/composition/" use:active on:click={onClickLink}>
                  Composition
                </a>
              </li>
              <li>
                <a
                  href="/nest/foreign-countries/"
                  use:active
                  on:click={onClickLink}>
                  Foreign countries
                </a>
              </li>
            </ol>
          </div>
        </li>
        <li>
          <a href="/page/about/" use:active on:click={onClickLink}>
            About
          </a>
        </li>
        <li>
          <a href="https://note.redgoose.me" target="redgoose-note" on:click={onClickLink}>
            Notes
          </a>
        </li>
      </ul>
    </nav>
  </div>
</header>

<script lang="ts">
import { active } from 'tinro'

let activeNavigation: boolean = false

function onClickLink(e: PointerEvent): void
{
  if (!e.currentTarget) return
  (e.currentTarget as HTMLElement).blur()
  activeNavigation = false
  window.removeEventListener('click', onCloseNavigation)
}

function onClickNavigationToggle(_: PointerEvent): void
{
  activeNavigation = !activeNavigation
  if (activeNavigation)
  {
    window.addEventListener('click', onCloseNavigation)
  }
}

function onCloseNavigation(_: PointerEvent): void
{
  activeNavigation = false
}
</script>

<style src="./index.scss" lang="scss"></style>
