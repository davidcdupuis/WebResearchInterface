## Real-Time Bidding

## Summary
[1. Introduction](#intro)  
[2. How RTB Ad Serving Works](#works)  
[3. SSP to DSP Cookie Syncing Explained](#cookies)  
[4. Cookie syncing step-by-step](#syncing)  

### <a name="intro">1. Introduction</a>

Real-time bidding (aka RTB) was created by Jason Knapp. It is a means by which advertising inventory is bought and sold on a per-impression basis, via programmatic instantatneous auction, similar to financial markets.

Real-time bidding lets advertisers manage and optimize ads from multiple **ad-networks** by granting the user access to a multitude of different networks, allowing them to create and launch advertising campaigns, prioritize networks and allocate percentages of unsold inventory, known as **backfill**.

RTB is distinguishable from static auctions by how it is a per-impression way of bidding whereas static auction are groups of up to several thousand impressions at once. Overall when compared to static auction, RTB is more effective for both advertisers and publishers in terms of advertising inventory sold. Advertisers have the ability to only bid on and buy the impressions they really want and publishers get top dollar for one impression.

### <a name="works">2. How RTB Ad Serving Works</a>

![RTB schema](/static/images/rtb-works.png)

When a browser navigates to a publisher website (1), the publisher's web server send back a bunch of HTML code (2) that tells the brwoser where to get the content (3) and how to format it. Part of the HTML code returned to the browser (4) will include a coded link known as an **ad tag**. (That part is the ame as in regular third-party ad serving). But instead of returning a DFA or Atlas tag, the Publisher Ad server will return a tag that points to a RTB-enabled SSP, typically through a dynamic Javascript tag that passes information like the publisher's ID, the site ID, and ad slot dimensions.  

From there, the user calls the SSP server (5) where the SSP reads that user's SSP cookie ID, likely already on their machine. Assuming the user already has that SSP's cookie on their machine, the SSP stat the action by requesting bids from a host of demand sources, the DSPs (6). If the user does not have an SSP cookie on their machine, their ad inventory can technically still be auctioned, but since nothing is known about that user, the price will be very low and more related to the site context than the user's attributes. For the DSPs to truly value the impression though, they need to know something about the user that is going to see it. This is where the SSP cookie ID comes in - packaged with the bid request is SSP's cookie ID, along with the URL the impression will deliver on, and what the current user's frequency is on the site.

All these factors help the DSP value the impression. First, through a rather complex cookie-syncing process, DSPs are able to match the SSP's cookie ID to their own cookie on that user, which is tied to a huge cache of marketed data and 3rd party data. Using the cookie ID, the DSP will be able to know if that user recently priced out a car, is flying to Paris in the next 90 days, was recently shoping for shoes, and even more demographic information about the user such as their age, gender, income range, credit score, and much, much more.

In addition to the cookie though, where the ad will appear, the URL, is also important. Many brands don't want their ads to appear on just any site, even if they want that user. If the user is on a site with PG-13 content, for example, the advertiser might bid a lower amount or not at all. Similarly, the frequency of that user to the site they are on is also important to valuation. Advertisers are willing to pay a premium to reach users on their firt or second pageview on a site vs. their 50th pageview for the simple fact that users are less engaged with site content and more likely to respond to an ad during their first few pageviews.

Using those pieces of data the DSPs all value that impression and submit a bid back to the SSP (7) as well an **ad redirect** to send the user should their bid win the auction. The SSP picks the winning bid and passes the DSP's redirect back to the user (8). From here the process is basically the same as third-party ad serving. The user calls the DSP (9), the DSP sends the user the marketer's ad server redirect (10), and the user call the marketer's ad server (11) and the marketed serves the user the final ad (12). The RTB ad serving process is complete!

### <a name="cookies">3. SSP to DSP Cookie Syncing Explained</a>

The matching process of the SSP cookie ID to the DSP cookie ID happens through a parallel process to serving ads called **cookie syncing** A cookie sync is necessary because as a standard security process, web servers of any kind can only request cookies that are set to their own domain. Since the SSP sits between the end-user and all the DSP bidders in a real-time auction however, the DSP needs a way to identify the user it's looking for.

<u>Why it's necessary</u>

user123visits storeABCs webpage adds a pair of shoes but never makes it to check out. storeABC want to retarget user123 to close the deal. storeABC works with DSP456 that drops cookie ID: DSPcookie789. user123 keeps surfing and lands on awesomesite.com which uses SSP123 to monetize their ad inventory, awesomesite.com serves a 3rd party redirect to SSP123, which drops a cookie on user123 with ID: SSPcookieXYZ. SSP123 now requests a bid from DSP456 among other bidders for the impression that SSPcookieXYZ is about to view. But wait, how does DSP456 know that SSPcookieXYZ = DSPcookie789? On this first ad, it doesn't, so your DSP doesn't bid on the impression. Bummer. Remember the SSP can only read and pass it's own cookie ID to bidders.

### <a name="syncing">4. Cookie syncing step-by-step</a>

![no image yet]()

Sources:  
  - Wikipedia  
  - Ad Ops Insider  
