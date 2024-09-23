const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to ", url);

mongoose.connect(url).then(_result => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Error connecting to MongoDB: ", error.message);
});

const entrySchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: function(v) {
                return /\(\d{3}\) \d{3}-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number! Please use the format (XXX) XXX-XXXX.`
        }
    },
    favorite: Boolean,
});

entrySchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model("Entry", entrySchema);