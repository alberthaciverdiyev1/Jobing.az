<% if (typeof js !== "undefined" && js) { %>
    <script type="module" src="/Js/<%= js %>"></script>
<% } %>

@if(isset($js))
    @foreach($js as $j)

    @endforeach
@endif
<script type="module" src="/Js/Global.js"></script>
<script type="module" src="/Js/Libraries/Alertify/alertify.min.js"></script>
<script type="module" src="/Js/Libraries/saleSlieder.min.js"></script>
<script src="/Js/Libraries/ckeditor.js"></script>
<script src="/Js/Libraries/Axios.min.js"></script>
<!-- <script src="https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js"></script> -->
<script src="https://cdn.jsdelivr.net/npm/nouislider@15.6.1/dist/nouislider.min.js"></script>



