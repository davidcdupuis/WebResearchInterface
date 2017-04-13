# Introduction to Databases

## Key-value database

A data storage paradigm designed for storing, retrieving and managing associative arrays, a data structure more commonly knwon as a dictionary or hash.

Dictionaries contain a collection of objects, or records, which in turn have many different fields within them, each containing data. These records are stored and retrieved using a key that uniquely identifies the record, and is used to quickly find the data within the database.

Key-value systems treat the data as a single opaque collection which may have different field for every record. This offers considerable flexibility and more closely follows modern concepts like object-oriented programming. Because optional values are not represented by placeholders as sin most RDBs, key-value stores use far-less memory to store the same database, which can lead to large performance gains in certain workloads.

Examples:
- RAM:               Redis, Aerospike, ...
- Solid-state drive: Couchbase, Aerospike, ...

## Document-oriented database

Aka semi-structured data. One of the main categories of NoSQL databases. XML databases are a subclass. Graph databases are similar but add another layer, the relationship, which allows them to link documents for rapid traversal.

Document-oriented databases are inherently a subclass of the key-value store. The difference lies in the way the data is processed. In a key-value store the data is considered to be inherently opaque to the database, whereas a document-oriented system relies on internal structure in the document in order to extract metadata that the database use for further optimization.

Document databases store all information for a given object in a single instance in the database, and every stored object can be different from every other.
