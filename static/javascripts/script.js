//GLOBAL VARIABLES
var authorsList;
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

function sortResults(data, prop, asc) {
    data.sort(function(a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
    return data;
}

function getPaperById(papers, id){
  for(var i = 0; i < papers.length; i++){
    if( papers[i].id == id){
      //console.log(papers[i]);
      return [papers[i]]; //we must return a list of results, even if just one result
    }
  }
  console.log("No papers found!");
}

function getPapersByYear(papers, year){
  var filteredPapers = [];
  for(var i = 0; i < papers.length; i++){
    //console.log(papers[i].year);
    if(papers[i].year != undefined && papers[i].year == year){

      filteredPapers.push(papers[i]);
    }
  }
  console.log(filteredPapers);
  return filteredPapers;
}

// Takes papers as input and displays them in results
function displayPapers(papers){
  for (var i = 0; i < papers.length ; i++){
    //initialize basic variables
    var background = "#EEEEEE";
    var summary = papers[i].problematic + " " + papers[i].solution;
    var authors = "";
    var saved = "#FF8A80";
    var printed = "#FF8A80";
    var score = "not defined";
    var problem = "";
    var solution = "";

    //redefine necessary variables
    if (papers[i].read == 'yes'){
      background = "#C8E6C9";
    } else if(papers[i].problematic != '' && papers[i].solution != ''){
      background = "#FFE0B2";
      problem = '<span style="color:#EF6C00;">' + papers[i].problematic + ' </span>';
      solution = '<span style="color:green;">' + papers[i].solution + '</span>';
    }

    if (papers[i].authors != undefined){
      for (var j = 0; j < papers[i].authors.length - 1; j++){
        authors += papers[i].authors[j] + " / ";
      }
      authors += papers[i].authors[papers[i].authors.length - 1];
    }

    if (papers[i].saved == 'yes') saved = 'lightgreen';
    if (papers[i].printed == 'yes') printed = 'lightgreen';
    if (papers[i].score != undefined) score = papers[i].score;

  $('#results').append('' +
  '<div id="' + papers[i].id + '" class="result mdl-card mdl-shadow--2dp" style="background-color:' + background + ';">'+
    '<div class="result-text-container mdl-shadow--2dp"style="">' + papers[i].title + '</div>'+
    '<div class="mdl-grid" style="padding-left:0px; padding-right:0px; width:100%">'+
      '<div class="result-text-container mdl-cell mdl-cell--3-col mdl-shadow--2dp" style="text-align:center;">' + papers[i].year + ' </div>'+
      '<div class="result-text-container mdl-cell mdl-cell--3-col mdl-shadow--2dp" style="text-align:center; background-color:' + saved + ';">saved</div>'+
      '<div class="result-text-container mdl-cell mdl-cell--3-col mdl-shadow--2dp" style="text-align:center; background-color:' + printed + ';">printed</div>'+
      '<div class="result-text-container mdl-cell mdl-cell--3-col mdl-shadow--2dp" style="text-align:center;">' + score + '</div>'+
    '</div>'+
    '<div class="result-text-container mdl-shadow--2dp" style="">' + problem + solution + '</div>'+
  '</div>'+
  '');
  }
}

function addPaperInfoToDisplayDialog(papers){
  var paper = papers[0];

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

  $('#display-dialog-id').text(paper.id);
  $('#display-dialog-title').text(paper.title);
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

  $('#display-dialog-problem').append('<span style="color:#EF6C00;">' + paper.problematic + ' </span>');
  $('#display-dialog-solution').append('<span style="color:green;">' + paper.solution + '</span>');
  if (paper.authors != undefined){
    var url = "";
    for (var i = 0; i < paper.authors.length; i++){
      for (var j = 0; j < authorsList.length; j++){
        if (authorsList[j].name == paper.authors[i]){
          url = authorsList[j].blog;
        }
      }
      $('#display-dialog-authors').append('<div class="mdl-cell mdl-cell--2-col mdl-shadow--2dp author"><a href="' + url + '" target="_blank">' + paper.authors[i]+ '</a></div>')
    }
  }

  if (paper.keywords != undefined){
    for (var i = 0; i < paper.keywords.length; i++){
      $('#display-dialog-keywords').append('<div class="mdl-cell mdl-cell--2-col mdl-shadow--2dp keyword">' + paper.keywords[i] + '</div>');
    }
  }

  if(paper.references != undefined){
    for (var i = 0; i < paper.references.length; i++){
      $('#display-dialog-references').append('<div class="mdl-cell mdl-cell--2-col mdl-shadow--2dp reference">' + paper.references[i] + '</div>');
    }
  }

  if(paper.url != undefined){
    $('#open-pdf').attr("href",paper.url);
  }
}

function addPaperInfoToEditDialog(papers){
  var paper = papers[0];
  //console.log("Enter function addPaperInfoToEditDialog")
  $('#edit-dialog-form').attr("action","/articles/edit");
  //ID
  $('#edit-dialog-id').attr('value',paper.id);
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

function clearInfoEditDialog(){
  $('#edit-dialog-form').attr("action","/articles/add");

  $('#edit-dialog-title').attr('value','');
  $('#edit-dialog-title')[0].value        = '';
  $('#edit-dialog-title').parent().removeClass('is-dirty');

  $('#edit-dialog-id').attr('value','');
  $('#edit-dialog-id')[0].value           = '';
  $('#edit-dialog-id').css('background-color','transparent');
  $('#edit-dialog-id').parent().removeClass('is-dirty');

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

function clearResults(){
  $('#results').text('');
}

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

  $.getJSON("static/data/authors.json",function(data){authorsList = data;});


  $.getJSON("static/data/data.json",function(data){
    //Initial sort, sorts papers by year
    var result = sortResults(data.papers,'year',false);

    //var result = getPaperById(data.papers,'adaptive-targeting');
    //displayPapers(result);

    //listen to the user clicking on an article
    var article_dialog = document.querySelector('#displayed-article');
    var edit_dialog = document.querySelector('#edit-dialog');
    var dialog = document.querySelector('dialog');
    var showModalButton = document.querySelector('#add');
    var confirmDelete = document.querySelector("#confirm-delete-dialog");

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

    $(document.body).on("click",".result",function(){
      //add paperInfo to Dialog
      var dialog_result = getPaperById(data.papers,this.id);

      addPaperInfoToDisplayDialog(dialog_result);
      article_dialog.showModal();

      $('#delete-article').click(function(){
        //display validate delete dialog/form
        var id = $('#display-dialog-id').text();
        confirmDelete.showModal();
        $('#article-id')[0].value = id;
      });

      $('#cancel-delete').click(function(){
        confirmDelete.close();
      });

      $('.cancel').click(function(){
        article_dialog.close();
        clearPaperInfoDialog();
      });
    });

    /*
    $('#search').click(function(){
      //console.log($('#search-id').val());
      var id = $('#search-id').val();
      var year = $('#search-year').val();
      var papers = result;

      if (id != undefined && id != ''){
        var papers = getPaperById(data.papers, id);
      }
      if (year != undefined && year != ''){
        var papers = getPapersByYear(data.papers, year);
      }
      //console.log(paper);
      clearResults();
      displayPapers(papers);
    });*/

    $('#reset').click(function(){
      clearResults();
      $('#search-id').val('');
      $('#search-year').val('');
      displayPapers(result);
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
  });

});
