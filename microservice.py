from time import sleep
import requests
import json

key = 'wGoGBLlJoPsdBTN7VGJVFuAYJTOqCkKl'
url = 'https://aeroapi.flightaware.com/aeroapi/flights/'


def createFiles():
    f = open("request.txt", "w")
    f.close()
    f = open("response.txt", "w")
    f.close()


def listenForRequest():
    # check for flight number in text file
    request = open("request.txt", "r+")
    flight = request.readline().strip()
    while not flight:
        request.close()
        sleep(1)
        request = open("request.txt", "r+")
        flight = request.readline().strip()

    # remove this
    sleep(2)

    # clear request text file
    request.truncate(0)
    request.close()
    sleep(1)

    return flight


def flightAware(flight):
    # send request to API
    r = requests.get(url + flight, headers={"x-apikey": key})
    return r


def writeResponse(r):
    with open("response.txt", "w") as response:

        # error handling for 4XX status codes
        if 399 < r.status_code < 500:
            json.dump({'Error': r.status_code}, response)
        else:
            json.dump(r.json(), response)

    # close response text file
    response.close()


createFiles()
while True:
    flight = listenForRequest()
    r = flightAware(flight)
    writeResponse(r)
