# world-factbook-site
World Factbook Front-end (API and web site) using 1) Azure: Cosmos DB / Azure Functions or 2) AWS: DynamoDB / Lambda Functions

The CIA World Factbook is a valuable online resource that contains a wealth of information about the countries of the world. It is also public domain, meaning you're free to take the data and use it for your own purposes such as analysis or correlation with other data in your possession. Thanks to Ian Coleman, there is a JSON edition of this data, updated weekly.

World Factbook Indexer is an Azure Durable Function that retrieves this data and updates both a Cosmos DB and Azure Blob Storage. It creates a back-end repository from which country data can be queries and displayed.

World Factbook Site (this repository) is a web site and API (via Azure Functions / AWS Lambda Functions) that allows browsing and searching of this data.
The site is currently hosted at:

http://world-factbook.aws.davidpallmann.com

http://world-factbook.azure.davidpallmann.com

For details, see these blog posts:

http://davidpallmann.blogspot.com/2019/02/cia-world-factbook-data-on-azure-part-1.html

http://davidpallmann.blogspot.com/2019/02/cia-world-factbook-data-on-azure-part-2.html

http://davidpallmann.blogspot.com/2019/02/cia-world-factbook-data-on-azure-part-3.html

http://davidpallmann.blogspot.com/2019/02/cia-world-factbook-data-on-aws-part-1.html

http://davidpallmann.blogspot.com/2019/02/cia-world-factbook-data-on-aws-part-2.html

# Web Site
The web site is simply a handful of files hosted in cloud storage. 

# API
The API defines a RESTful front-end for the country lookup, search, and charting capabilities provided by the Azure Functions or Lambda Functions.

# Functions
The Azure Functions or Lambda Functions power the API. They are written in JavaScript, are entered in the cloud management portal, and connect to the CosmosDB or DynamoDB database.

