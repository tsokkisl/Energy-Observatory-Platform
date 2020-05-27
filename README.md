# Software Engineering NTUA
A project for the 'Software Engineering' course -  School of Electrical and Computer Engineering NTUA (Fall 2019).

## Project Description
The following project was implemented during the Software Engineering course at school of Electrical and Computer Engineering - NTUA. The goal was to implement an energy production/consumption observatory platform, that anyone can have free access to through a REST API. The web service is mainly aimed at power generating companies, Ministries of Energy within the European Union, ordinary citizens and journalists. The platform will provide users with services such as access to large datasets of energy production, consumption and forecasts, as well as an admin interface for system management. The open data that are used for this project can be found here: https://transparency.entsoe.eu. In addition, the primary goals of this service are platform usability, documentation and code maintenance.



## Collaborators
* [Lenos Tsokkis](https://github.com/tsokkisl)
* [Constantina Fountouradaki](https://github.com/Con-Fou)
* [Stavros Stavrou](https://github.com/stavros2)

## Project Structure
* `/documentation`: Project Documentation using UML diagrams, as well as providing StRS and SRS documents. The language used is Greek.
* `/back-end`: The source code for the RESTful API requests as well as the code for accessing the database is supplied in this directory. Additionally, functionality tests for both the CLI client and the back-end code is supplied in the `/test` subdirectory.
* `/cli-client`: The source code for the Command Line Interface client.

## Setup
1. Install Node.js
2. Install the database server of your choice and import data.sql file
3. Configure the .env file accordingly (be careful to locate it, in the back-end directory)
4. Run the build.bat (Windows) or the build.sh (Linux or MAC OSX) to build the application

## Tools and Technologies used
<u>Database</u>

* MySQL

<u>back-end</u>

* Node.js
* Express.js

<u>Build Automation</u>

* npm

<u>Testing</u>

* Mocha
