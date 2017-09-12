# Research Web Interface

The Research Web Interface (RWI) is a Flask web interface designed specifically to answer my research needs.

The interface is organised in several sections:

- Home
- Articles
- Discover
- Visualizations
- Documentation
- Resources
- Ideas / Notes
- Questions
- Dictionary

Although I have designed and coded this interface to answer my own personal needs, I hope that it may be used
by any other researcher who might find it useful and who might enjoy contributing to it.

There exist many available software for organising scientific papers but none I have found offer
a nice display, easy-to-use functionalities and great visualizations. I do not claim to achieve perfection
but I am hoping that an interested community might participate in this open-source project to facilitate the work of the
scientific community.

## Home

The basic introductory page for both the interface and the research subject itself.
In my case: Real-Time Bidding.

![Home Screenshot](./screenshots/home_page.png)

## Articles

This is where one should be able to find a complete list of all the relevant articles that he or she has found online.

- The user should be able to filter articles to search for specific ones
- The user should be able to manually add, edit and delete any article
  - This implies being able to add existing or new authors, existing or new keywords and existing or new references (I believe this to be quite challenging.)
- The user should be able to easily view the most important article information: title, year, saved, printed, score and summary


![Article Screenshot](./screenshots/articles_page.png)

![Add Article Card Screenshot](./screenshots/add_article_card.png)

- The user should be able to click on an article to view it's card and eventually edit it
- The user should be able to open the PDF of the article in a new tab
- The user should be able to open an author card from the article card

![Article Card Screenshot](./screenshots/article_card.png)

## Discover

The visual aspect of this page has not been coded although a programmatic approach has been suggested in a test script. The idea
is to use the DBLP API to gather articles that are found using certain keywords.

- The user should be able to search the web for articles related to certain keywords, authors, etc.
- The user should be able to view the basic information of the suggested articles
- The user should be able to selected desired articles and immediately add them to his database of articles

It would also be interesting to suggest an initial article score based on the quality of the conference using CORE and other information.

![Discover Screenshot](./screenshots/discover_page.png)

## Visualizations

This is where one should be able to visualize all the most interesting aspects of his or her articles and
the relationships that the articles have amongst themselves.

- The user should be able to view a graph of articles connected by references
  - Upon clicking a node, the user should view it's neighbors
  - A user should be able to view clusters of articles by keywords
  - ...
- The user should be able to view a histogram of articles by year, keywords, authors, etc.
  - More filters should be able to be applied (if useful)
- The user should be able to view a tree diagram of the ancestry of an article

It would be interesting to connect these visualizations with the Articles page in order to allow the user to click a node and view it's details.
We can imagine a visual database interface in one hand and an article statistics visualization tool in another.

![Visualization Screenshot](./screenshots/visualization_page.png)

## Documentation

This is where one should be able to find all blog type articles written to further explain the research theme.

- Articles are colored by type and can be filtered by type

For RTB there are different types of docs:

- Basic
- Business
- Programmatic
- Mathematics
- Machine Learning

These articles should be easy to add and edit for the user. Maybe some external library could be used to facilitate this.

![Documentation Screenshot](./screenshots/documentation_page.png)

## Resources

This is where one should be able to find a list of resources concercing the research theme.

There are different types of resources:

- Blog
- Book
- Online Article
- News Article

![Resources Screenshot](./screenshots/resources_page.png)

## Notes

This section allows the user to properly gather and organise his or her thoughts regarding his research.

I find myself sometimes taking notes but forgeting about them. This would allow me to
aggregate the necessary information all in one clean page.

![Notes Screenshot](./screenshots/notes_page.png)

## Questions

There are many questions that can be asked about specific domains. It is important to take note of the question and of it's answer if available. Often an unanswered question can be the source of further investigation, research and eventually innovation. Having available a list of all questions and answers will prove useful when things get more complex.

![Questions Screenshot](./screenshots/questions_page.png)

## Dictionary

There are many important, complex and specific terms to every research domain. I find it's important to have a list of terms and definitions available.

![Dictionary Screenshot](./screenshots/dictionary_page.png)

## Further Work

Everything here is subjet to change but there are additional features that I would be interested in implementing.

- An article "id" generator to use with references between articles or some other solution
- An article reference manager to easily associate articles amongst themselves through their ids without having to manually do so.
- Allow user to access his or her account via a login and password to provide security of information and multiple accounts
- Maybe make it all responsive for accessing via a smartphone or tablet...
