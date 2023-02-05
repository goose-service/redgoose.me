<header class="layout-header">
  <div class="layout-header__wrap">
    <h1 class="layout-header__logo">
      <a href={navigation.home.href} on:click={onClickLink}>
        <img src="/images/ico-logo.webp" width="229" height="196" alt="redgoose"/>
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
      aria-hidden="true"
      class="header-navigation"
      class:on={activeNavigation}
      on:click={onClickMenu}>
      <ul>
        {#each gnb as o,k}
          <li>
            <a href={o.href} target={o.target} use:active on:click={onClickLink}>
              {o.label}
            </a>
            {#if o.children?.length > 0}
              <div>
                <ol>
                  {#each o.children as oo}
                    <li>
                      <a href={oo.href} target={oo.target} use:active on:click={onClickLink}>
                        {oo.label}
                      </a>
                    </li>
                  {/each}
                </ol>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </nav>
  </div>
</header>

<script lang="ts">
import { active } from 'tinro'
import navigation from '../../../../server/resource/navigation.json'

let activeNavigation: boolean = false

$: gnb = navigation.global.map((o) => ({
  label: o.label,
  href: o.href,
  target: /^http/.test(o.href) ? '_blank' : '',
  children: o.children?.map(oo => {
    return {
      label: oo.label,
      href: oo.href,
      target: /^http/.test(oo.href) ? '_blank' : '',
    }
  })
}))

function onClickMenu(e): void
{
  if (!e.target.classList.contains('header-navigation')) return
  e.stopPropagation()
}

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
