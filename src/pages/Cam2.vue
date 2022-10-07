<template>
  <q-page style="padding-top:300px">
    <link href='https://fonts.googleapis.com/css?family=Lato:100,400,700' rel='stylesheet' type='text/css'>

    <nav class="navigation" id="mainNav">
          <a class="navigation__link" href="#1">Section 1</a>
          <a class="navigation__link" href="#2">Section 2</a>
          <a class="navigation__link" href="#3">Section 3</a>
          <a class="navigation__link" href="#4">Section 4</a>
            <a class="navigation__link" href="#5">Section 5</a>
            <a class="navigation__link" href="#6">Section 6</a>
            <a class="navigation__link" href="#7">Section 7</a>
    </nav>

    <div class="page-section hero" id="1">
          <h1>Smooth scroll, fixed jump menu with active class</h1>
    </div>
    <div class="page-section" id="2">
          <h1>Section Two</h1>
    </div>
    <div class="page-section" id="3">
          <h1>Section Three</h1>
    </div>
    <div class="page-section" id="4">
          <h1>Section Four</h1>
    </div>
    <div class="page-section" id="5">
          <h1>Section Five</h1>
    </div>
    <div class="page-section" id="6">
          <h1>Section Six</h1>
    </div>
    <div class="page-section" id="7">
          <h1>Section Seven</h1>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'cam2',
  created () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll (event) {
      scrollTo(22)
      console.log('here')
      // Any code to be executed when the window is scrolled
    }
  }
}
</script>

<style lang="scss">
* {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
  transition: all .1s ease;
}

html, body {
    height: 100%;
}

h1 { font-size: 64px; }

.page-section {
    height: 480px;
    width: 50%;
    margin-left: 35%;
    margin-top: 5%;
    padding: 3em;
    background: linear-gradient(45deg, #43cea2 10%, #185a9d 90%);
    color: white;
    box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.5);
}

.navigation {
    position: fixed;
    width: 30%;
    margin-left: 2%;
    background-color: #999;
    color: #fff;

    &__link {
      display: block;
      color: #ddd;
      text-decoration: none;
      padding: 1em;
      font-weight: 400;

      &:hover {
        background-color: #aaa;
      }

      &.active {
        color: white;
        background-color: rgba(0,0,0,0.5);
      }
    }
}
</style>
