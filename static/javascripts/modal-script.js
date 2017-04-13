$(document).ready(function(){
  var dialog = document.querySelector('dialog');
  var showModalButton = document.querySelector('#add');

  if (! dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }

  showModalButton.addEventListener('click', function() {
    clearInfoEditDialog();
    $('#edit-dialog-form').attr("action","/articles/add");
    dialog.showModal();
  });

  dialog.querySelector('.cancel').addEventListener('click', function() {
    dialog.close();
  });

  if (! article_dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
  }
});
