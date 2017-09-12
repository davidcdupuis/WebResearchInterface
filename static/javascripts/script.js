//GLOBAL VARIABLES
var global_article;

// global list variables for adding and deleting connections
var authors;
var references;
var terms;

//var socket = io('ws://localhost:3000/');

/**
* Function that adds paper information to new_article variable
* Returns the result
*/
function addPaper(){
  //get info from dialog edit-dialog
  var new_article = {
    "id":"",
    "title":"",
    "year":"",
    "read":"no",
    "saved":"no",
    "printed":"no",
    "url":"",
    "authors":[],
    "keywords":[],
    "problematic":"",
    "solution":"",
    "references":[]
  };

  new_article.id          = $('#edit-dialog-id')[0].value;
  new_article.title       = $('#edit-dialog-title')[0].value;
  new_article.year        = $('#edit-dialog-year')[0].value;
  new_article.score       = $('#edit-dialog-score')[0].value;

  if($('#edit-dialog-saved').parent().hasClass('is-checked')){
    new_article.saved     = 'yes'
  }
  if($('#edit-dialog-printed').parent().hasClass('is-checked')){
    new_article.printed   = 'yes'
  }
  if($('#edit-dialog-read').parent().hasClass('is-checked')){
    new_article.read      = 'yes'
  }

  new_article.url         = $('#edit-dialog-url')[0].value;

  //process list of authors
  new_article.authors     = $('#edit-dialog-authors')[0].value;

  //process list of keywords
  new_article.keywords    = $('#edit-dialog-keywords')[0].value;
  new_article.problematic = $('#edit-dialog-problem')[0].value;
  new_article.solution    = $('#edit-dialog-solution')[0].value;

  //process list of references
  new_article.references  = $('#edit-dialog-references')[0].value;

  //console.log("New article:");
  //console.log(new_article);

  return new_article;
}

/**
* Function to verify if all necessary info was put into the edit/add dialog
* Id and title are required
*/
function validateSave(){
  if ($('#edit-dialog-id').text == '' || $('#edit-dialog-title').text == ''){
    //add error message
    console.log("Error: Article ID or Title not specified");
  }else{
    return true;
  }
}

/**
* Function that gets a paper and displays it's info in a
* non-editable article dialog
*/
function addPaperInfoToDisplayDialog(paper){
  //initialize variables
  var background = "#EEEEEE";
  var saved = "#FF8A80";
  var printed = "#FF8A80";
  var score = "not defined";
  var problem = "";
  var solution = "";

  if (paper.score != undefined){
    for (var i = 0; i < paper.score; i++){
      $('#display-dialog-score').append('<span>&starf;</span>');
    }
  } else {
    $('#display-dialog-score').append('<span style="color:black;">&star;</span>');
  }

  $('#display-dialog-title').text(paper.title);
  $('#display-dialog-where').text(paper.where);
  $('#display-dialog-year').text(paper.year);
  if (paper.saved == 'yes'){
    $('#display-dialog-saved').css('background-color','lightgreen');
  }else{
    $('#display-dialog-saved').css('background-color','#FF8A80');
  }

  if (paper.printed == 'yes'){
    $('#display-dialog-printed').css('background-color','lightgreen');
  }else{
    $('#display-dialog-printed').css('background-color','#FF8A80');
  }

  if (paper.read == 'yes'){
    $('#display-dialog-read').css('background-color','lightgreen');
  }else{
    $('#display-dialog-read').css('background-color','#FF8A80');
  }

  $('#display-dialog-problem').append('<span style="color:#EF6C00;">' + paper.problem + ' </span>');
  $('#display-dialog-solution').append('<span style="color:green;">' + paper.solution + '</span>');
  if (paper.authors != undefined){
    for (var i = 0; i < paper.authors.length; i++){
      $('#display-dialog-authors').append('<span class="mdl-chip author"><span class="mdl-chip__text">' + paper.authors[i] + '</span></span>')
    }
  }

  if (paper.keywords != undefined){
    for (var i = 0; i < paper.keywords.length; i++){
      $('#display-dialog-keywords').append('<span class="mdl-chip keyword"><span class="mdl-chip__text">' + paper.keywords[i] + '</span></span>');
    }
  }

  if(paper.references != undefined){
    for (var i = 0; i < paper.references.length; i++){
      $('#display-dialog-references').append('<span class="mdl-chip reference"><span class="mdl-chip__text">' + paper.references[i] + '</span></span>');
    }
  }

  if(paper.url != undefined){
    $('#open-pdf').attr("href",paper.link);
  }
}

/**
* Function that adds the info of the desired paper to an
* editable article dialog to await for modifications
*/
function addPaperInfoToEditDialog(paper){
  //console.log("Enter function addPaperInfoToEditDialog")
  $('#edit-dialog-form').attr("action","/articles/edit");

  //TITLE
  $('#edit-dialog-title').attr('value',paper.title);
  $('#edit-dialog-title')[0].value = paper.title;
  $('#edit-dialog-title').parent().addClass('is-dirty');

  //YEAR
  if (paper.year != undefined){
    $('#edit-dialog-year').attr('value',paper.year);
    $('#edit-dialog-year')[0].value = paper.year;
    $('#edit-dialog-year').parent().addClass('is-dirty');
  }

  //URL
  if (paper.link != undefined){
    $('#edit-dialog-link').attr('value',paper.link);
    $('#edit-dialog-link')[0].value = paper.link;
    $('#edit-dialog-link').parent().addClass('is-dirty');
  }

  if (paper.where != undefined){
    $('#edit-dialog-where').attr('value',paper.where);
    $('#edit-dialog-where')[0].value = paper.where;
    $('#edit-dialog-where').parent().addClass('is-dirty');
  }

  //SAVED
  if (paper.saved != undefined && paper.saved == 'yes'){
    $('#edit-dialog-saved').parent().addClass('is-checked');
  }

  //PRINTED
  if (paper.printed != undefined && paper.printed == 'yes'){
    $('#edit-dialog-printed').parent().addClass('is-checked');
  }

  //READ
  if (paper.read != undefined && paper.read == 'yes'){
    $('#edit-dialog-read').parent().addClass('is-checked');
  }

  //SCORE
  if (paper.score != undefined){
    $('#edit-dialog-score').attr('value',paper.score);
    $('#edit-dialog-score')[0].value = paper.score;
    $('#edit-dialog-score').parent().addClass('is-dirty');
  }

  //PROBLEM
  if (paper.problem != undefined){
    $('#edit-dialog-problem').attr('value',paper.problem);
    $('#edit-dialog-problem')[0].value = paper.problem;
    $('#edit-dialog-problem').parent().addClass('is-dirty');
  }

  //SOLUTION
  if (paper.solution != undefined){
    $('#edit-dialog-solution').attr('value',paper.solution);
    $('#edit-dialog-solution')[0].value = paper.solution;
    $('#edit-dialog-solution').parent().addClass('is-dirty');
  }

  //AUTHORS
  if (paper.authors != undefined){
    for (var i = 0; i < paper.authors.length; i++){
      $('#edit-dialog-authors').append('<span class="mdl-chip mdl-chip--deletable author"><span class="mdl-chip__text">' + paper.authors[i] + '</span><button type="button" class="mdl-chip__action delete-author"><i class="material-icons">cancel</i></button></span>')
    }
  }

  //KEYWORDS
  if (paper.keywords != undefined){
    for (var i = 0; i < paper.keywords.length; i++){
      $('#edit-dialog-keywords').append('<span class="mdl-chip mdl-chip--deletable keyword"><span class="mdl-chip__text">' + paper.keywords[i] + '</span><button type="button" class="mdl-chip__action delete-keyword"><i class="material-icons">cancel</i></button></span>')
    }
  }

  //REFERENCES
  if (paper.references != undefined){
    for (var i = 0; i < paper.references.length; i++){
      $('#edit-dialog-references').append('<span class="mdl-chip mdl-chip--deletable reference"><span class="mdl-chip__text">' + paper.references[i] + '</span><button type="button" class="mdl-chip__action delete-reference"><i class="material-icons">cancel</i></button></span>')
    }
  }

  //NOTES
  if (paper.notes != undefined){
    for (var i = 0; i < paper.notes.length; i++){
      $('edit-dialog-notes').append('<div class="mdl-card mdl-shadow--4dp" style="width:100%; border: 8px solid #efc734;"><div class="mdl-card__title"><div class="mdl-card__subtitle-text">06/07/2017</div></div><div class="mdl-card__supporting-text">Lorem ipsum </div><div class = "mdl-card__actions mdl-card--border"><a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect delete-note" style="float:right;">DELETE</a></div></div>');
    }
  }
}

/**
* Function that clears are the info from the Edit Dialog
*/
function clearInfoEditDialog(){
  $('#edit-dialog-form').attr("action","/articles/add");

  $('#edit-dialog-title').attr('value','');
  $('#edit-dialog-title')[0].value        = '';
  $('#edit-dialog-title').parent().removeClass('is-dirty');

  $('#edit-dialog-link').attr('value','');
  $('#edit-dialog-link')[0].value          = '';
  $('#edit-dialog-link').parent().removeClass('is-dirty');

  $('#edit-dialog-year').attr('value','');
  $('#edit-dialog-year')[0].value         = '';
  $('#edit-dialog-year').parent().removeClass('is-dirty');

  $('#edit-dialog-score').attr('value','');
  $('#edit-dialog-score')[0].value        = '';
  $('#edit-dialog-score').parent().removeClass('is-dirty');

  $('#edit-dialog-where').attr('value','');
  $('#edit-dialog-where')[0].value        = '';
  $('#edit-dialog-where').parent().removeClass('is-dirty');

  $('#edit-dialog-saved').parent().removeClass('is-checked');
  $('#edit-dialog-printed').parent().removeClass('is-checked');
  $('#edit-dialog-read').parent().removeClass('is-checked');

  $('#edit-dialog-problem').attr('value','');
  $('#edit-dialog-problem')[0].value      = '';
  $('#edit-dialog-problem').parent().removeClass('is-dirty');

  $('#edit-dialog-solution').attr('value','');
  $('#edit-dialog-solution')[0].value     = '';
  $('#edit-dialog-solution').parent().removeClass('is-dirty');

  //don't forget to clear the inputs as well
  $('#edit-dialog-authors').empty();

  $('#edit-dialog-keywords').empty();

  $('#edit-dialog-references').empty();
}

/**
* Function that clears all the info from the Displayed Dialog
*/
function clearPaperInfoDialog(){
  $('#display-dialog-score').text('');
  $('#display-dialog-id').text('');
  $('#display-dialog-title').text('');
  $('#display-dialog-year').text('');
  $('#display-dialog-problem').text('');
  $('#display-dialog-solution').text('');
  $('#display-dialog-authors').text('');
  $('#display-dialog-keywords').text('');
  $('#display-dialog-references').text('');
}

/**
* Function that verifies if necessary info in form to be submitted
*/
function validateForm(){
  id     = document.forms["edit-dialog-article"]["id"].value;
  title  = document.forms["edit-dialog-article"]["title"].value;

  if (id == '' || title == ''){
    console.log("Id or Title not defined");
    return false;
  }else{
    return true;
  }
}

$(document).ready(function(){
  var edit_dialog = document.querySelector('#edit-dialog');
  var confirmDelete = document.querySelector("#confirm-delete-dialog");
  //var dialog = document.querySelector('dialog');
  var showModalButton = document.querySelector('#add');

  $('body').on('click','#add',function() {
    clearInfoEditDialog();
    $('#edit-dialog-form').attr("action","/articles/add");
    edit_dialog.showModal();

    $('body').on('click','.cancel',function(){
      edit_dialog.close();
    });
  });

  $('body').on('click','#edit-dialog-author-button',function(){
    //add author chip to authors div + author value to authors hidden input
    $('#edit-dialog-authors').append('<span class="mdl-chip mdl-chip--deletable author"><span class="mdl-chip__text">' + $('#edit-dialog-author-input').val() + '</span><button type="button" class="mdl-chip__action delete-author"><i class="material-icons">cancel</i></button></span>');
    console.log("Author added");
  });

  $('body').on('click','#edit-dialog-keyword-button',function(){
    $('#edit-dialog-keywords').append('<span class="mdl-chip mdl-chip--deletable keyword"><span class="mdl-chip__text">' + $('#edit-dialog-keyword-input').val() + '</span><button type="button" class="mdl-chip__action delete-keyword"><i class="material-icons">cancel</i></button></span>');
  });

  $('body').on('click','#edit-dialog-reference-button',function(){
    $('#edit-dialog-references').append('<span class="mdl-chip mdl-chip--deletable reference"><span class="mdl-chip__text">' + $('#edit-dialog-reference-input').val() + '</span><button type="button" class="mdl-chip__action delete-reference"><i class="material-icons">cancel</i></button></span>');
  });

  $('body').on('click','.delete-author',function(){
    $(this).parent().remove();
    //remove author name from list of authors as input
    console.log("delete author clicked");
  });

  $('body').on('click', '.delete-keyword', function(){
    $(this).parent().remove();
    //remove author name from list of keywords as input
  });

  $('body').on('click', '.delete-reference', function(){
    $(this).parent().remove();
    //remove author name from list of references as input
  });

  $('body').on('click','.result',function(){
    var article_dialog = document.querySelector('#displayed-article');
    var var_key = $(this).attr('id');
    $.post('/articles/display',{
      key : var_key
    }).done(function(article){
      //clear modal info
      global_article = article
      clearPaperInfoDialog();

      //This is important for evaluating changes
      authors = global_article.authors;
      references = global_article.references;
      terms = global_article.keywords;

      addPaperInfoToDisplayDialog(global_article);
      article_dialog.showModal();

      $('body').on('click','.cancel',function(){
        article_dialog.close();
      });

      $('body').on('click','#edit-article',function(){
        article_dialog.close();

        clearInfoEditDialog();
        addPaperInfoToEditDialog(global_article);
        //displayEditDialog
        edit_dialog.showModal();


      });

    }).fail(function(){
      console.log('Unable to retrieve data from database');
    });
  });

  $('body').on('click','.cancel',function(){
    //clear edit_dialog
    edit_dialog.close();
  });

  $('body').on('click','.save', function(){
    if (validateSave()){

      // get new set of authors, references, terms ...
      $('#edit-dialog-authors').children().text().slice(0,-6).split('cancel');

      console.log("Saved validated");
      new_article = addPaper();
      console.log("New article generated");
      //socket.emit('saveArticle',{article: new_article, type:'edit'});
      edit_dialog.close();
    }
  });
  
});
