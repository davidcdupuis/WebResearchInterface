#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, redirect, url_for, jsonify, Markup
import json, os, numpy, markdown
import dblp, pandas as pd
from neo4j.v1 import GraphDatabase, basic_auth

app = Flask(__name__)

driver = GraphDatabase.driver("bolt://localhost:7687", auth=basic_auth("neo4j","1234"))
session = driver.session()

with open('static/data/vocabulary.json', 'r') as f:
    vocabulary = json.load(f)

# FUNCTIONS

INDENT = 3
SPACE = " "
NEWLINE = "\n"

def to_json(o, level = 0):
    ret = ""
    if isinstance(o, dict):
        ret += "{" + NEWLINE
        comma = ""
        for k,v in o.iteritems():
            ret += comma
            comma = ",\n"
            ret += SPACE * INDENT * (level+1)
            ret += '"' + str(k) + '":' + SPACE
            ret += to_json(v, level + 1)

        ret += NEWLINE + SPACE * INDENT * level + "}"
    elif isinstance(o, basestring):
        ret += '"' + o + '"'
    elif isinstance(o, list):
        ret += "[" + ",".join([to_json(e, level+1) for e in o]) + "]"
    elif isinstance(o, bool):
        ret += "true" if o else "false"
    elif isinstance(o, int):
        ret += str(o)
    elif isinstance(o, float):
        ret += '%.7g' % o
    elif isinstance(o, numpy.ndarray) and numpy.issubdtype(o.dtype, numpy.integer):
        ret += "[" + ','.join(map(str, o.flatten().tolist())) + "]"
    elif isinstance(o, numpy.ndarray) and numpy.issubdtype(o.dtype, numpy.inexact):
        ret += "[" + ','.join(map(lambda x: '%.7g' % x, o.flatten().tolist())) + "]"
    elif o is None:
        ret += 'null'
    else:
        raise TypeError("Unknown type '%s' for json serialization" % str(type(o)))
    return ret

def find_article(id, data):
    for i in range(0, len(data)):
        if data[i]['id'] == id:
            return i
    return -1

def get_article_info(result):
    article = {}
    for r in result:
        print("Printing r: ")
        print(r)
        article['key']         = r['key']
        article['link']        = r['link']
        article['title']       = r['title']
        article['year']        = r['year']
        article['score']       = r['score']
        article['where']       = r['where']
        article['saved']       = r['saved']
        article['printed']     = r['printed']
        article['read']        = r['read']
        article['problem']     = r['problem']
        article['solution']    = r['solution']
        article['authors']     = r['authors']
        article['keywords']    = r['keywords']
        article['references']  = r['references']
        article['notes']       = r['notes']
    return article

# ROUTES

@app.route('/')
def index():
    return render_template('index.html', name = 'Home')

# ARTICLES

@app.route('/articles', methods = ['GET'])
def display_articles():
    #print(articles["papers"][0])
    global articles
    #with open('static/data/data.json', 'r') as f:
    #    articles = json.load(f)
    # if a get method is inputed then query article info and send to page

    articles = session.run("MATCH (art:Article) RETURN art.unique_key AS key, art.title AS title, art.year AS year, art.saved AS saved, art.printed AS printed, art.read AS read, art.problem AS problem, art.solution AS solution ORDER BY art.year DESC")
    print("All articles fetched.")

    return render_template('articles.html', name = 'Articles', articles = articles)#articles["papers"]

@app.route('/articles/add', methods = ['POST'])
def addArticle():
    print "Add Article function"
    print(request.form)

    new_article = {
        "id":"",
        "title":"",
        "year":"",
        "score":"",
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

    new_article['id']          = request.form['id']
    new_article['title']       = request.form['title']
    new_article['year']        = request.form['year']
    new_article['score']       = request.form['score']

    if('read' in request.form):
        new_article['read']    = "yes"

    if('saved' in request.form):
        new_article['saved']   = 'yes'

    if('printed' in request.form):
        new_article['printed'] = 'yes'

    new_article['url']         = request.form['url']
    new_article['authors']     = [str.strip(str(x)) for x in request.form['authors'].split(',')]
    new_article['keywords']    = [str.strip(str(x)) for x in request.form['keywords'].split(',')]
    new_article['problematic'] = request.form['problem']
    new_article['solution']    = request.form['solution']
    new_article['references']  = [str.strip(str(x)) for x in request.form['references'].split(',')]

    print("\n")
    #print(new_article)

    #add new article to data.json and save
    articles["papers"].append(new_article)
    #print(to_json(new_article))

    new_data = to_json(articles)
    os.remove('static/data/data.json')
    with open('static/data/data.json','w') as f:
        f.write(new_data.encode('utf-8'))

    print("Article added: {0}".format(new_article['id']))

    return redirect('/articles')

@app.route('/articles/edit', methods = ['POST'])
def editArticle():
    print "Edit Article Function"

    print(request.form)
    new_article = {
        "id":"",
        "title":"",
        "year":"",
        "score":"",
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

    new_article['id']          = request.form['id']
    new_article['title']       = request.form['title']
    new_article['year']        = request.form['year']
    new_article['score']       = request.form['score']

    if('read' in request.form):
        new_article['read']    = "yes"

    if('saved' in request.form):
        new_article['saved']   = 'yes'

    if('printed' in request.form):
        new_article['printed'] = 'yes'

    new_article['url']         = request.form['url']
    new_article['authors']     = [str.strip(str(x)) for x in request.form['authors'].split(',')]
    new_article['keywords']    = [str.strip(str(x)) for x in request.form['keywords'].split(',')]
    new_article['problematic'] = request.form['problem']
    new_article['solution']    = request.form['solution']
    new_article['references']  = [str.strip(str(x)) for x in request.form['references'].split(',')]

    print("\n")
    print(new_article)

    #edit article and save to data.json file
    print("Edited article: {0}".format(new_article['id']))
    return redirect('/articles')

@app.route('/articles/delete', methods = ['POST'])
def deleteArticle():
    # find article in data
    if request.form:
        print("Article id to delete: {0}".format(request.form['article-id']))
        r = find_article(request.form['article-id'], articles['papers'])
        if r == -1:
            print("Article {0} cannot be found".format(request.form['article-id']))
            return redirect('/articles')

        articles['papers'].remove(articles['papers'][r])

        new_data = to_json(articles)
        os.remove('static/data/data.json')
        with open('static/data/data.json','w') as f:
            f.write(new_data.encode('utf-8'))

        print("Deleted article: {0}".format(request.form['article-id']))
    else:
        print("Delete form not found")
    return redirect('/articles')

@app.route('/articles/display', methods = ['POST'])
def display_article():
    try:
        result = session.run("MATCH (art:Article {unique_key: {key_variable}}), (art)<-[:WROTE]-(a:Author) RETURN art.unique_key as key, art.title AS title, art.year AS year,art.score as score, art.where as where, art.saved as saved, art.printed as printed, art.read as read, art.link as link, art.problem as problem, art.solution as solution, art.keywords as keywords, art.references as references, art.notes as notes, COLLECT(a.full_name) AS authors",key_variable = eval(request.form['key']))
    except Exception as e:
        print('*** ', e)
        session.rollback()

    article = get_article_info(result)
    # uselessss
    return jsonify({
        'key': article['key'],
        'title': article['title'],
        'year': article['year'],
        'where': article['where'],
        'saved': article['saved'],
        'printed': article['printed'],
        'read': article['read'],
        'problem': article['problem'],
        'solution': article['solution'],
        'authors': article['authors'],
        'references': article['references'],
        'keywords': article['keywords'],
        'notes':    article['notes']
    })
# DISCOVER

@app.route('/discover')
def discover():
    return render_template('discover.html')

# VISUALISATION

@app.route('/filter',methods = ['POST'])
def filter():
    return redirect('/articles')

@app.route('/visualisations')
def visualisations():
    return render_template('visualisations.html', name = 'Visualisations')

# DOCUMENTATION

@app.route('/documentation')
def documentation():
    # Get all the available documents and display information on page
    with open('static/data/docs/info.json', 'r') as f:
        file_info = json.load(f)
    return render_template('documentation.html', name = 'Documentation', file_info = file_info)

@app.route('/documentation/<file_name>', methods = ['GET','POST'])
def display_doc(file_name):
    # get document by document name (id ?)
    print(file_name)
    filename = 'static/data/docs/' + request.form["path"]
    with open(filename, 'r') as f:
        content = f.read()
    doc = Markup(markdown.markdown(content))

    return render_template('document.html', content = doc)

# RESOURCES

@app.route('/resources', methods = ['GET','POST'])
def resources():

    with open('static/data/resources.json') as f:
        resources = json.load(f)
    return render_template('resources.html', name = 'Resources',resources = resources)

# NOTES

@app.route('/notes', methods = ['GET','POST'])
def notes():
    with open('static/data/notes.json') as f:
        notes = json.load(f)
    return render_template('notes.html', name = 'Notes', notes = notes)

# QUESTIONS

@app.route('/questions', methods = ['GET','POST'])
def questions():
    return render_template('questions.html', name = 'Questions')

# DICTIONARY

@app.route('/dictionary', methods = ['GET','POST'])
def dictionary():
    return render_template('dictionary.html', name = 'Dictionary', data = vocabulary)

#Test form
@app.route('/test')
def form():
    return render_template('test.html')

@app.route('/test/signup', methods = ['POST'])
def signup():
    user = {
        "email":""
    }
    user['email'] = request.form['email']
    print(user)
    return redirect('test')

@app.errorhandler(404)
def page_not_found(error):
    return render_template('error.html'), 404

if __name__ == "__main__":
    app.run()
