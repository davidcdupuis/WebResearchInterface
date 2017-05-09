//GLOBAL VARIABLES

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

  $('#display-dialog-id').text(paper.key);
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
    var url = "";
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
function addPaperInfoToEditDialog(papers){
  //console.log("Enter function addPaperInfoToEditDialog")
  $('#edit-dialog-form').attr("action","/articles/edit");
  //ID
  $('#edit-dialog-id').attr('value',paper.key);
  $('#edit-dialog-id')[0].value = paper.id;
  $('#edit-dialog-id').prop('disabled',true);
  $('#edit-dialog-id').css('background-color','#F8F8FF');
  $('#edit-dialog-id').parent().addClass('is-dirty');

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
  if (paper.url != undefined){
    $('#edit-dialog-url').attr('value',paper.url);
    $('#edit-dialog-url')[0].value = paper.url;
    $('#edit-dialog-url').parent().addClass('is-dirty');
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
  if (paper.problematic != undefined){
    $('#edit-dialog-problem').attr('value',paper.problematic);
    $('#edit-dialog-problem')[0].value = paper.problematic;
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
    $('#edit-dialog-authors').attr('value',paper.authors);
    $('#edit-dialog-authors')[0].value = paper.authors;
    $('#edit-dialog-authors').parent().addClass('is-dirty');
  }

  //KEYWORDS
  if (paper.keywords != undefined){
    $('#edit-dialog-keywords').attr('value',paper.keywords);
    $('#edit-dialog-keywords')[0].value = paper.keywords;
    $('#edit-dialog-keywords').parent().addClass('is-dirty');
  }

  //REFERENCES
  if (paper.references != undefined){
    $('#edit-dialog-references').attr('value',paper.references);
    $('#edit-dialog-references')[0].value = paper.references;
    $('#edit-dialog-references').parent().addClass('is-dirty');
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

  $('#edit-dialog-url').attr('value','');
  $('#edit-dialog-url')[0].value          = '';
  $('#edit-dialog-url').parent().removeClass('is-dirty');

  $('#edit-dialog-year').attr('value','');
  $('#edit-dialog-year')[0].value         = '';
  $('#edit-dialog-year').parent().removeClass('is-dirty');

  $('#edit-dialog-score').attr('value','');
  $('#edit-dialog-score')[0].value        = '';
  $('#edit-dialog-score').parent().removeClass('is-dirty');

  $('#edit-dialog-saved').parent().removeClass('is-checked');
  $('#edit-dialog-printed').parent().removeClass('is-checked');
  $('#edit-dialog-read').parent().removeClass('is-checked');

  $('#edit-dialog-problem').attr('value','');
  $('#edit-dialog-problem')[0].value      = '';
  $('#edit-dialog-problem').parent().removeClass('is-dirty');

  $('#edit-dialog-solution').attr('value','');
  $('#edit-dialog-solution')[0].value     = '';
  $('#edit-dialog-solution').parent().removeClass('is-dirty');

  $('#edit-dialog-authors').attr('value','');
  $('#edit-dialog-authors')[0].value      = '';
  $('#edit-dialog-authors').parent().removeClass('is-dirty');

  $('#edit-dialog-keywords').attr('value','');
  $('#edit-dialog-keywords')[0].value     = '';
  $('#edit-dialog-keywords').parent().removeClass('is-dirty');

  $('#edit-dialog-references').attr('value','');
  $('#edit-dialog-references')[0].value   = '';
  $('#edit-dialog-references').parent().removeClass('is-dirty');
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
  var article_dialog = document.querySelector('#displayed-article');
  var edit_dialog = document.querySelector('#edit-dialog');
  var confirmDelete = document.querySelector("#confirm-delete-dialog");
  //var dialog = document.querySelector('dialog');
  var showModalButton = document.querySelector('#add');

  $('#add').click(function() {
    clearInfoEditDialog();
    $('#edit-dialog-form').attr("action","/articles/add");
    edit_dialog.showModal();

    $('.cancel').click(function(){
      edit_dialog.close();
    });
  });

  $('#edit-article').click(function(){
    var id = $('#display-dialog-id').text();
    var papers = getPaperById(data.papers, id);

    //close article_dialog
    article_dialog.close();

    clearInfoEditDialog();
    addPaperInfoToEditDialog(papers);
    //displayEditDialog
    edit_dialog.showModal();
    $('.cancel').click(function(){
      //clear edit_dialog
      edit_dialog.close();
    })

    $('.save').click(function(){
      if (validateSave()){
        console.log("Saved validated");
        new_article = addPaper();
        console.log("New article generated");
        //socket.emit('saveArticle',{article: new_article, type:'edit'});
        edit_dialog.close();
      }
    })

  });

  $('#addAuthor').click(function(){
    //add author chip to authors div + author value to authors hidden input
    $('#edit-authors').append('<span class="mdl-chip mdl-chip--deletable author"><span class="mdl-chip__text">' + $('#edit-dialog-author').val() + '</span><button type="button" class="mdl-chip__action delete-author"><i class="material-icons">cancel</i></button></span>');
    console.log("Author added");
  });

  $('#addKeyword').click(function(){
    $('#edit-keywords').append('<span class="mdl-chip mdl-chip--deletable keyword"><span class="mdl-chip__text">' + $('#edit-dialog-keyword').val() + '</span><button type="button" class="mdl-chip__action delete-keyword"><i class="material-icons">cancel</i></button></span>');
  });

  $('#addReference').click(function(){
    $('#edit-references').append('<span class="mdl-chip mdl-chip--deletable reference"><span class="mdl-chip__text">' + $('#edit-dialog-reference').val() + '</span><button type="button" class="mdl-chip__action delete-reference"><i class="material-icons">cancel</i></button></span>');
  });

  $('.delete-author').click(function(){
    $(this).parent().remove();
    //remove author name from list of authors as input
  });

  $('.delete-keyword').click(function(){
    $(this).parent().remove();
    //remove author name from list of keywords as input
  });

  $('.delete-reference').click(function(){
    $(this).parent().remove();
    //remove author name from list of references as input
  });

  $('.result').click(function(){
    var var_key = $(this).attr('id');
    $.post('/articles/display',{
      key : var_key
    }).done(function(article){
      //clear modal info
      clearPaperInfoDialog();
      addPaperInfoToDisplayDialog(article);
      article_dialog.showModal();

      $('.cancel').click(function(){
        article_dialog.close();
      });

    }).fail(function(){
      console.log('Unable to retrieve data from database');
    });
  });

});
