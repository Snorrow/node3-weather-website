const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

//Define paths for Express-config
const viewsPath = path.join(__dirname, '../templates/views');
const publicDirectoryPath = path.join(__dirname, '../public');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
   res.render('index', {
       title: 'Weather App',
       name: 'Andrew Mead'
   });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Andrew Mead'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Andrew Mead',
        message: 'This is a sample message.'
    });
});

app.get('/weather', (req, res) => {
    if(!req.query.address) return res.send('No address was entered');
    geocode(req.query.address, (error, {location, latitude, longitude} = { }) => {
       if (error) return res.send({error:"Please doublecheck the input."});
       forecast(latitude, longitude, (error, forecastData) => {
          if(error) return res.send({error:"Forecast-service not working."});
          res.send([{
              address: req.query.address,
              forecast: forecastData,
              location
          }]);
       });
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        message: 'Help article not found.'
    });
});

//Has to be set up last => first looks for a match, then it looks at the wildcard.
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        message: 'Page not found.'
    });
});

app.listen(port, () => {
    console.log('Server is up on port: ' + port)
});