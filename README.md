Microservice Communication Contract

file: microservice.py 

<br/>

To request data from the microservice: 

&emsp;Write the flight number to the request.txt file in the appropriate directory.
  
To receive data from the microservice: 

&emsp;Continually check the response.txt file for the data after sending the request.

&emsp;Once data is received, save it inside a variable. 

&emsp;Clear response.txt file.

<br />

This Python-based microservice relies on text files as its primary communication pipeline. 
Upon start, the microservice will create two blank text files, request.txt and response.txt.
If these files already exist, they will be cleared of content.
The microservice will be continually checking the request.txt file for content (flight number).
Once request data is received, the microservice will save the data in a variable and clear request.txt.
A GET request will be made to the FlightAware API with the provided flight number.
FlightAware API will either return an error code or response data.
This data will be written to response.txt in JSON format by the microservice and is now available to the requesting program.
If query is unsuccessful, the error status code will be the value for key "Error" in response.

<br />
  
<img width="1450" alt="microserviceUML" src="https://github.com/kelseyanncollins/cs361_project/assets/107971152/ab20adbc-305e-459a-98a2-d3589af8762d">


  
