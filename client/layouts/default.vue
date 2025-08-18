<template>
<div class="layout">
  <header class="layout-header">
    <div class="wrap">
      <h1 class="logo">
        <router-link :to="navigation.home.href">
          <img
            src="/images/ico-logo.webp"
            width="229"
            height="196"
            :alt="navigation.home.label"/>
        </router-link>
      </h1>
      <nav class="toggle-navigation">
        <button
          type="button"
          title="toggle menu"
          :class="[ state.activeNavigation && 'on' ]"
          @click.stop="onClickNavigationToggle">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="nonzero" d="M3 18h18v-2H3v2zm0-5h10v-2H3v2zm0-7v2h14V6H3z"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </nav>
      <transition>
        <nav
          aria-hidden="false"
          :class="[
            'navigation',
            state.activeNavigation && 'on',
          ]"
          @click="onClickMenu">
          <ul>
            <li v-for="o in _navigation">
              <a
                :href="o.href"
                :target="o.target"
                :class="{
                  'active': route.path !== '/' && route.path.startsWith(o.href),
                }"
                @click.prevent="onClickLink">
                {{o.label}}
              </a>
              <div v-if="o.children?.length > 0">
                <ol>
                  <li v-for="oo in o.children">
                    <a
                      :href="oo.href"
                      :target="oo.target"
                      :class="{
                        'active': route.path !== '/' && route.path.startsWith(oo.href),
                      }"
                      @click.prevent="onClickLink">
                      {{oo.label}}
                    </a>
                  </li>
                </ol>
              </div>
            </li>
          </ul>
        </nav>
      </transition>
      <nav class="dark-mode-switch">
        <goose-dark-mode-switch
          :theme="store.data.theme"
          @change="onChangeTheme"/>
      </nav>
    </div>
  </header>
  <div class="container">
    <slot/>
  </div>
  <footer class="layout-footer">
    <p class="layout-footer__copyright">
      Copyright 2013-{{_currentYear}} redgoose. All right reserved.
    </p>
  </footer>
</div>
</template>

<script setup>
import { reactive, computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import navigation from '../../server/resource/navigation.json'

const router = useRouter()
const route = useRoute()
const store = inject('store')
const state = reactive({
  activeNavigation: false,
})

const _navigation = computed(() => {
  return navigation.global.map(o => {
    return {
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
    }
  })
})
const _currentYear = computed(() => {
  return (new Date()).getFullYear()
})

function onClickNavigationToggle(_)
{
  state.activeNavigation = !state.activeNavigation
  if (state.activeNavigation)
  {
    window.addEventListener('click', onCloseNavigation)
  }
}

function onCloseNavigation(_)
{
  state.activeNavigation = false
}

function onClickMenu(e)
{
  if (!e.target.closest('.navigation').classList.contains('navigation')) return
  e.stopPropagation()
}

function onClickLink(e)
{
  if (!e.currentTarget) return
  e.currentTarget.blur()
  state.activeNavigation = false
  window.removeEventListener('click', onCloseNavigation)
  const href = e.currentTarget.getAttribute('href')
  const target = e.currentTarget.getAttribute('target')
  if (!href) return
  if (target) history.href = href
  else router.push(href)
}

function onChangeTheme(_e)
{
  store.changeTheme(_e.detail.theme)
}
</script>

<style src="./default.scss" lang="scss"></style>
