@if(isset($js))
    @foreach($js as $j)

    @endforeach
@endif

@vite('Modules/Web/resources/assets/js/global.js')
@vite('Modules/Web/resources/assets/js/libraries/ckeditor.js')
@vite('Modules/Web/resources/assets/js/libraries/sale_slider.min.js')
@vite('Modules/Web/resources/assets/js/libraries/axios.min.js')
@vite('Modules/Web/resources/assets/js/libraries/alertify/alertify.min.js')
<!-- <script src="https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js"></script> -->
<script src="https://cdn.jsdelivr.net/npm/nouislider@15.6.1/dist/nouislider.min.js"></script>



