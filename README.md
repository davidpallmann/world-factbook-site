# world-factbook-site
World Factbook Front-end (API and web site) using Cosmos DB / Azure Functions

This project is the front-end for this related project: https://github.com/davidpallmann/world-factbook-indexer
For details, see this blog post http://davidpallmann.blogspot.com/2019/02/cia-world-factbook-data-on-azure-part-1.html


The CIA World Factbook is a valuable online resource that contains a wealth of information about the countries of the world. It is also public domain, meaning you're free to take the data and use it for your own purposes such as analysis or correlation with other data in your possession. Thanks to Ian Coleman, there is a JSON edition of this data, updated weekly.

World Factbook Indexer is an Azure Durable Function that retrieves this data and updates both a Cosmos DB and Azure Blob Storage. It creates a back-end repository from which country data can be queries and displayed.
World Factbook Site (this repository) is a web site and API (via Azure Functions) that allows browsing and searching of this data.
The site is currently hosted at https://worldfactbook.blob.core.windows.net/site/index.html

# Web Site
The web site is simply index.html and site.css and a background image, a static web page hosted in Azure Blob Storage.

# API
The API defines a RESTful front-end for the country lookup and search capabilities provided by the Azure Functions.

# Functions
The Azure Functions power the API. They are written in JavaScript, are entered in the Azure Portal, and are configured to use Cosmos DB input bindings.

