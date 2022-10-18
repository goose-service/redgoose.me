<div class="index-empty">
  <img
    src="/images/img-error.png"
    alt="error"
    class="index-empty__image"/>
  <p class="index-empty__message">
    Not found article.
  </p>
</div>

<style lang="scss">
@use '../../../assets/scss/mixins';

.index-empty {
  display: grid;
  place-content: center;
  height: calc(100vh - var(--size-header-height) - 180px);
  text-align: center;
  box-sizing: border-box;
  padding-top: 30px;
  user-select: none;
  &__image {
    display: block;
    width: 180px;
    margin: 0 auto;
  }
  &__message {
    margin: 30px 0 0;
    font-family: var(--font-eng);
    color: var(--color-text-blur);
    font-size: 14px;
    font-weight: 200;
  }
  @include mixins.responsive(tablet) {
    height: calc(100vh - var(--size-header-height) - 420px);
    min-height: 480px;
    max-height: 640px;
    &__image {
      width: 240px;
    }
    &__message {
      margin-top: 42px;
      font-size: 16px;
    }
  }
}
</style>
