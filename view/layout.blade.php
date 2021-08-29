<!doctype html>
<?php
if(!defined("__GOOSE__")){exit();}

/**
 * layout
 */

/** @var array $navigation */
/** @var string $pageTitle */

$nest_id = isset($nest_id) ? $nest_id : null;
?>
<html lang="ko">
<head>
@include('head')
</head>
<body ontouchstart="">
<h1 class="page-title">{{$pageTitle}}</h1>
<main>
  <header class="layout-header">
    <div class="layout-header__wrap">
      <div class="layout-header__logo">
        <a href="{{__ROOT__}}/">
          <img src="{{__ROOT__}}/assets/images/ico-logo@2x.png" alt="redgoose">
        </a>
      </div>
      <nav class="layout-header__buttons">
        <button type="button" title="toggle menu" class="navigation">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="nonzero" d="M3 18h18v-2H3v2zm0-5h10v-2H3v2zm0-7v2h14V6H3z"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </nav>
      <nav class="header-navigation">
        <ul>
          @foreach ($navigation as $key=>$nav)
          <li class="{{isset($nav->active) && $nav->active ? 'on' : ''}}">
            <a href="{{$nav->link}}" target="{{$nav->target}}">{{$nav->label}}</a>
            @if (isset($nav->children) && count($nav->children) > 0)
            <div>
              <ol>
                @foreach ($nav->children as $key2=>$nav2)
                <li class="{{isset($nav2->active) && $nav2->active ? 'on' : ''}}">
                  <a href="{{$nav2->link}}" target="{{$nav2->target}}">{{$nav2->label}}</a>
                </li>
                @endforeach
              </ol>
            </div>
            @endif
          </li>
          @endforeach
        </ul>
      </nav>
    </div>
  </header>
  <div class="container">
    @yield('contents')
  </div>
  <footer class="layout-footer">
    <p class="layout-footer__copyright">Copyright 2013-{{date('Y')}} redgoose. All right reserved.</p>
  </footer>
</main>

@yield('script')
<script src="{{__ROOT__}}/assets/dist/app.js"></script>
</body>
</html>
