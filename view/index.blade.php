<?php
if(!defined("__GOOSE__")){exit();}

/**
 * intro page
 */

/** @var string $title */
/** @var string $pageTitle */
/** @var array $index */
/** @var int $count */
/** @var array $randomIndex */
/** @var object $paginate */
?>

@extends('layout')

@section('meta')
<title>{{ $title }}</title>
<meta name="description" content="{{ getenv('DESCRIPTION') }}"/>
<meta property="og:title" content="{{ $title }}"/>
<meta property="og:description" content="{{ getenv('DESCRIPTION') }}">
<meta property="og:image" content="{{ __API__ }}/usr/icons/og-redgoose.jpg">
@endsection

@section('contents')
<article class="intro">
  <h2 class="intro__title">Intro page</h2>
  <div class="index intro__index">
    @if ($count)
      <div class="index__works index--head">
        <ul>
          @foreach($index->head as $k=>$item)
            <li class="index__work">
              <a href="/article/{{$item->srl}}/">
                <figure>
                  @if (isset($item->image))
                    <img src="{{__API__}}/{{$item->image}}" alt="{{$item->title}}">
                  @endif
                </figure>
                <div>
                  <strong>{{$item->title}}</strong>
                  @if (isset($item->nestName) || isset($item->categoryName))
                    <span>
                  @if (isset($item->nestName))
                        <em>{{$item->nestName}}</em>
                      @endif
                      @if (isset($item->categoryName))
                        <em>{{$item->categoryName}}</em>
                      @endif
                </span>
                  @endif
                </div>
              </a>
            </li>
          @endforeach
        </ul>
      </div>
      <div class="index__random-works">
        <ul>
          @foreach($randomIndex as $k=>$item)
            <li class="index__work">
              <a href="/article/{{$item->srl}}/">
                <figure>
                  @if (isset($item->image))
                    <img src="{{__API__}}/{{$item->image}}" alt="{{$item->title}}">
                  @endif
                </figure>
                <div>
                  <strong>{{$item->title}}</strong>
                  @if (isset($item->nestName) || isset($item->categoryName))
                    <span>
                @if (isset($item->nestName))
                        <em>{{$item->nestName}}</em>
                      @endif
                      @if (isset($item->categoryName))
                        <em>{{$item->categoryName}}</em>
                      @endif
              </span>
                  @endif
                </div>
              </a>
            </li>
          @endforeach
        </ul>
      </div>
      <div class="index__works index--body">
        <ul>
          @foreach($index->body as $k=>$item)
            <li class="index__work">
              <a href="/article/{{$item->srl}}/">
                <figure>
                  @if (isset($item->image))
                    <img src="{{__API__}}/{{$item->image}}" alt="{{$item->title}}">
                  @endif
                </figure>
                <div>
                  <strong>{{$item->title}}</strong>
                  @if (isset($item->nestName) || isset($item->categoryName))
                    <span>
                @if (isset($item->nestName))
                        <em>{{$item->nestName}}</em>
                      @endif
                      @if (isset($item->categoryName))
                        <em>{{$item->categoryName}}</em>
                      @endif
              </span>
                  @endif
                </div>
              </a>
            </li>
          @endforeach
        </ul>
      </div>
    @else
      <div class="index__empty">
        <img src="{{__ROOT__}}/assets/images/img-error.png" alt="error">
        <p>Not found work.</p>
      </div>
    @endif
    @if ($paginate->total > 0)
      <div class="index__paginate">
        {!! $paginate->mobile !!}
        {!! $paginate->desktop !!}
      </div>
    @endif
  </div>
</article>
@endsection

@section('script')
<script src="{{__ROOT__}}/assets/vendor/jquery-3.3.1.min.js"></script>
<script src="{{__ROOT__}}/assets/dist/app.js"></script>
@endsection