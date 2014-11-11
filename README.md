<h3>An angular js admin app.</h3>

Uses several charing libraries including : 

Chartjs<br/>
Flotcharts<br/>
morris charts<br/>

It is built using bootstrap with several custom features.

Also included are grunt configurations for development testing and production deployment.

<h4>Install using grunt : </h4>

1 ) Install node js (http://nodejs.org/download/)

2 ) Install necessary packages :

grunt-contrib-jshint
grunt-contrib-clean
grunt-contrib-connect
grunt-contrib-compress
grunt-contrib-cssmin
grunt-contrib-concat
grunt-contrib-uglify
grunt-html2js
grunt-contrib-watch
grunt-bower-task


3 ) In the application root folder run : npm install

This will install all grunt dependencies so that tasks can be run

4 ) Run :

grunt dev - For development
grunt test - For testing purposes
grunt minified - For production

All files will be concatenated in the dist/app.js file

Website will be deployed on http://localhost:8080 (path can be configured in the Gruntfile.js)



