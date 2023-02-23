import json
from flask import Flask, request
import requests
from flask_cors import CORS


app = Flask(__name__, static_folder='static')

CORS(app)

# @app.route('/')  # create a route for the home page of the application
# def home():  # assign a method to it which has to return something
#     return "Hello, world!"


@app.route('/')
def home():
    return app.send_static_file("index.html")


# call ticketmaster API event search api and return json data.

eventURL = 'https://app.ticketmaster.com/discovery/v2/events.json?'
urlPlusKey = eventURL + 'apikey=FZGp2ugVvf6nEtONz0ufDrMgdjYPXgwA'


@app.route('/eventSearch')
def eventSearch():
    payload = {'keyword': request.args['keyword'], 'segmentId': request.args['segmentId'],
               'radius': request.args['radius'], 'unit': request.args['unit'],
               'geoPoint': request.args['geoPoint']}
    r = requests.get(urlPlusKey,
                     params=payload)

    return r.json()


# call ticketmaster API event details api and return json data.
detailsURL = 'https://app.ticketmaster.com/discovery/v2/events/'


@app.route("/eventDetails")
def eventsDetail():
    urlAddId = detailsURL + request.args['id'] + \
        '.json?apikey=' + request.args['apikey']
    r = requests.get(urlAddId)
    return r.json()


# call ticketmaster venue API
venueURL = 'https://app.ticketmaster.com/discovery/v2/venues?'


@app.route("/venue")
def venue():
    payload = {'apikey': request.args['apikey'],
               'keyword': request.args['keyword']}

    r = requests.get(venueURL, params=payload)
    return r.json()


if __name__ == "__main__":

    app.run(port=5000, debug=True)
