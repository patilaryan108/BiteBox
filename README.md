# BiteBox 
Is a location based MERN stack platform which helps customer to discover nearby Restaurant and stores with real-time information such as price , menu items , open status of shop ...

The idea came from every day frustration where you want some items and there is no reliable platform which give you that whether near by store have that item , what it cost , even the shop is open or not ; You end up with a wasted trip . # BiteBox solve this problem by letting shopkeeper manage and update their store inventory , while customer can search and filter by the specific items. 
Platform support 3 roles - Customer , Shopkeeper , Admin with JWT authentication and role-based access. Customer get the location-based search powered by MongoDB geospatial indexing, ranking using a custom scoring formula that combines rating , price and distance . Shopkeeper mange their store menu and pricing through a dedicated dashboard. Admin moderate the platform and feature popular item on homepage. 

On tech side I have used React and Tailwind CSS for frontend , Express.js and Node.js for backend , MongoDB for database and JWT, Passport and bcrypt for authentication and Security. 
