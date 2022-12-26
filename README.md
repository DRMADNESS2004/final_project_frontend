Country/Citizen Simulation

Link to 2nd front-end repository: https://github.com/DRMADNESS2004/final_project_frontend.git
Link to back-end repository: https://github.com/DRMADNESS2004/Final_Project_BackEnd_JWP.git

My application allows users to add countries and citizens to a list. It also allows them to interact with a map to add countries or citizens more easily. Furthermore, the users can delete the countries and the citizens by clicking on them. They can also modify countries by changing their population through the form in a similar way they are added. 

My project was built using React js for the front-end and REST API with Spring Boot and JPA for the backend. I also used the librairies react-hook-form to implement forms easier and react-simple-maps to display a world map SVG with the countries defined. I used Intellij IDEA Ultimate to code my back-end and Visual Studio Code to code my front-end. 

o How to run the project.

To run the project, the backend needs to be run first. The backend is going to add the world's countries' names and population into the possible_countries table in the h2 database. Then, the front-end can be run.  

o Some challenges that you faced and features you hope to implement in the future.

One of the challenges I faced during the process of making my project was crashing my project. The crash was caused by node modules I had downloaded that were using a webpack in a version lower than 5 which didn't provide polyfills for these modules anymore. To fix it, I copied and pasted the necessary components into another repository and continued from there. 

Another challenge I faced was rendering the citizens inside the countries when they were added. Initially, whenever I added a citizen into a specific country, the country wouldn't display the citizen I just added. However, I figured out that I could render my citizens state not just when countries are displayed but also when the citizens state is modified.

One of the features I hope to implement in the future is being able to drag and drop the countries within a certain area to make the website more interactive and the citizens into another country. 

Another feature I hope to implement is displaying more information about countries other than their population.

- Design:
o Brief explanation behind the classes structure of the projects. Imagine writing this for
someone that will continue development in your project.
I created a Country entity that has String name, int population and boolean selected. The selected is used to check when the country has been selected. If it has, it'll display the country's population and its citizens. I created a Citizen entity with String name, boolean selected, a Many to One relationship with Country (many citizens can be in one country, if the country is deleted, the citizens inside are deleted, the foreign key is country_id which is the id of the country), a One to One relationship with Job (a citizen can only have one job, if the citizen is deleted, the job is deleted). There's also a Job entity which has String name, int salary, and int weeklyHours. The PossibleCountry entity is only used to store the world's possible countries' names with their population. In the controllers, only responses are returned, never the entity itself. The services take care of the functionality. The repositories extend CrudRepository and define the CRUD operations on our entity. The requests make sure that the fields in the request are valid. The ResourceNotFoundException class extends RunTimeException and is thrown when the id that's being accessed is not found. The controllers process the incoming requests and return the responses based on the URL they are defined.

o Database Design: Entity-Relationship Diagram

o End-points documentation for your backend

o Screenshots of the Web Application frontend explaining the features of the app
(desktop and mobile screenshots)