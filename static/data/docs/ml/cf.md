# Collaborative Filtering (CF)

Collaborative filtering is a method of making automatic predictions (filtering) about the interests of a user by collecting preferences or taste information from many users (collaborating). In the more general sense, collaborative filtering is the process of filtering for information or patterns using techniques involving collaboration among multiple agents, viewpoints, data sources, etc.

CF often requires:  
- (1) Users' active participation  
- (2) An easy way to represent users' interests  
- (3) Algorithms that are able to match people with similar interests  

A key problem of collaborative filtering is combining and weighting the preferences of user neighbors.

## Challenges

**Data Sparsity**
> Many commercial recommender systems are based on large datasets. As a result, the user-item matrix used for CF could be extremely large and sparse. One typical problem is the **cold start**: new users won't have past preferences data. This is also true for new items.

**Scalability**
> With tens of millions of customers O(M) and millions of items O(N), a CF algorithm with the complexity of n is already too large. Many systems need to react in real-time to answer online requirements. Large web companies such as Twitter use clusters of machines to scale recommendations for their millions of users, with most computations happening in very large memory machines.

**Synonyms**
> Tendency of a number of the same or very similar items to have different names or entries. Most recommender systems are unable to discover this latent association and thus treat these products differently.
> Topic Modeling (Latent Dirichlet Allocation) can solve naming issues by grouping different words belonging to the same topic.

**Gray Sheep**
> Users who do not consistently agree or disagree with any group of people and thus do not beneft from CF. Black sheep are the opposite groupe whose idiosyncratic tastes makes recommendations nearly impossible.

**Diversity and the long taill**
> Collaborative filtering are expected to increase diversiy because they help discover new products. Some algorithms, however may unintentionally do the opposite. They can create a rich-get-richer effect for popular products.


## Item-item collaborative filtering

Collaborative filtering based on the similarity between items calculated using people's ratings of those items.

User-user cf had many problems:  
- systems performed poorly when they had many items but comparatively few ratings  
- computing similarities between all pairs of users was expensive  
- user profiles changed quickly and the entire system model had to be recomputed  

Source:  
- Wikipedia  
