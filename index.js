require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

const Entry = require("./models/entry");


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




morgan.token('post-data', (req, res) => { 
    if (req.method === "POST") {
        return JSON.stringify(req.body);
    };
    return " ";
});

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post-data"));

app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
    Entry.find({}).then(entries => {
        response.json(entries);
    });
});

app.get("/info", (request, response) => {
    const length = `Phonebook has info for ${phonebook.length} people.`;
    const time = new Date();

    response.send(`<p>${length}<br/><br/>${time}.</p>`);
});

app.get("/api/persons/:id", (request, response, next) => {

    Entry.findById(request.params.id).then(entry => {
        if (entry) {
            response.json(entry);
        } else {
            response.status(404).end();
        };
    }).catch(error => next(error));

    // const id = request.params.id;
    // const person = phonebook.find(entry => entry.id === id);

    // if (person) {
    //     response.json(person);
    // } else {
    //     response.statusMessage = `The person id of ${id} does not currently exist in the phonebook...`;
    //     response.status(404).end();
    // };
});

app.delete("/api/persons/:id", (request, response, next) => {
    // const id = request.params.id;
    // phonebook = phonebook.filter(entry => entry.id !== id);
    // response.status(204).end();

    Entry.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end();
    }).catch(error => next(error));
});

const generateId = () => {
    const random = phonebook.length > 0 ? Math.round(Math.random() * (1000000 - 1)) : 0;
    return String(random);
}

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: "Name is missing from the body content..."
        });
    };

    if (!body.number) {
        return response.status(400).json({
            error: "Number is missing from the body content..."
        });
    };

    const foundName = phonebook.find((entry) => entry.name === body.name);
    const foundNumber = phonebook.find((entry) => entry.number === body.number);


    if (foundName && foundNumber) {
        return response.status(400).json({
            error: "Name and number both already exist in the phonebook. Use different variables."
        });
    };

    if (foundName) {
        return response.status(400).json({
            error: "Name already exists in the phonebook. Use another name."
        });
    };

    if (foundNumber) {
        return response.status(400).json({
            error: "Number already exists in the phonebook. Use another number."
        });
    };



    const entry = new Entry({
        name: body.name,
        number: body.number,
        favorite: Boolean(body.favorite) || false,
        id: generateId()
    });

    entry.save().then(savedEntry => {
        response.json(savedEntry);
    });

    // phonebook = phonebook.concat(entry);
    // response.json(entry);
});


const unknownEndpoint = (request, response) => {
    response.status(404).send({error: "Unknown Endpoint..."});
};

app.use(unknownEndpoint);


const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({error: "Malformatted id"});
    };
    next(error);
};

app.use(errorHandler);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});