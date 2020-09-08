<template>
  <div>
    <nuxt />
    <footer class="footer">
      <div class="content has-text-centered">
        <small>
          <strong>Scaling Science Explore</strong> supported in part by the
          <a href="https://sloan.org/">Alfred P. Sloan Foundation</a> and the
          <a href="https://www.knowledgefutures.org/">
            Knowledge Futures Group
          </a>
        </small>
      </div>
    </footer>
  </div>
</template>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background-color: hsl(0, 0%, 98%);
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.padding-1 {
  padding: 1rem;
}

span[data-tooltip].border-bottom-none {
  border-bottom: none;
}
</style>
