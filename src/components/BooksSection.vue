<template>
  <div class="title row items-center q-pa-md">
    <h4 class="text-weight-medium col-9 col-md-10">
      Livros e dicas
    </h4>
    <div class="row items-center">
      <div class="col-3 col-md-2 flex flex-center">
        <img src="images/book_windguru_for_dummies.png" alt="Livros e dicas" style="max-width: 100%; height: auto; cursor: pointer;" @click="$emit('show-dont-need-dialog')" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BooksSection',
  emits: ['show-dont-need-dialog']
}

</script>
