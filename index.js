const express = require("express");
const app = express();

app.use(express.json());

let phonebook = [
    {
        "id": "1",
        "name": "Mario Mario",
        "number": "(843) 727-8954",
        "favorite": true
    },
    {
        "id": "2",
        "name": "Hazel-Rah",
        "number": "(464) 919-7737",
        "favorite": false
    },
    {
        "id": "3",
        "name": "Jason Funderburker",
        "number": "(919) 747-2179",
        "favorite": false
    },
    {
        "id": "4",
        "name": "Link Link",
        "number": "(222) 222-2222",
        "favorite": false
    },
];

app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
    response.json(phonebook);
});

app.get("/info", (request, response) => {
    const length = `Phonebook has info for ${phonebook.length} people.`;
    const time = new Date();

    response.send(`<p>${length}<br/><br/>${time}.</p>`);
});




const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});