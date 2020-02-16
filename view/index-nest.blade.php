<?php
if(!defined("__GOOSE__")){exit();}

/**
 * articles page in nest
 */

/** @var string $title */
/** @var string $pageTitle */
/** @var array $index */
/** @var object $paginate */
/** @var string $categoryName */
?>

@extends('layout')

@section('meta')
<title>{{$title}}</title>
<meta name="description" content="{{ getenv('DESCRIPTION') }}"/>
<meta property="og:title" content="{{ $title }}"/>
<meta property="og:description" content="{{ getenv('DESCRIPTION') }}">
<meta property="og:image" content="{{ __API__ }}/usr/icons/og-redgoose.jpg">
@endsection

@section('contents')
<article class="index">
  <header class="index__header">
    <h2>{{$pageTitle}}</h2>
    @if (isset($categories) && count($categories))
    <nav class="index__categories">
      <button type="button">
        <span>
          <em>Categories / {{$categoryName ? $categoryName : 'All'}}</em>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6">
            <g fill="none" fill-rule="evenodd">
              <path fill="currentColor" d="M12 0L6 6 0 0z"></path>
            </g>
          </svg>
        </span>
      </button>
      <nav>
        <ul>
          @foreach($categories as $k=>$item)
            <li{!!($category_srl === $item->srl || (!$category_srl && !$item->srl)) ? ' class="on"' : ''!!}>
              <a href="/nest/{{$nest_id}}{{$item->srl ? '/'.$item->srl : ''}}/" data-srl="{{$item->srl}}">
                <span>{{$item->name}}</span>
                <em>{{$item->count_article}}</em>
              </a>
            </li>
          @endforeach
        </ul>
      </nav>
    </nav>
    @endif
  </header>
  <div class="index__works index--head">
    @if ($index && count($index))
    <ul>
      @foreach($index as $k=>$item)
      <li class="index__work">
        <a href="/article/{{$item->srl}}/" class="wrap">
          <figure class="image">
            @if (isset($item->image))
            <img src="{{__API__}}/{{$item->image}}" alt="{{$item->title}}">
            @endif
          </figure>
          <div class="caption">
            <strong class="title">{{$item->title}}</strong>
            <em class="regdate">{{$item->regdate}}</em>
          </div>
        </a>
      </li>
      @endforeach
    </ul>
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
