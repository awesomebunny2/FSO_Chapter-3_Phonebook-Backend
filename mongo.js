const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("Give password as argument");
    process.exit(1);
};

const password = process.argv[2];


const url = `mongodb+srv://awesomebunny:${password}@fso-phonebook.tp9m0.mongodb.net/phonebook?retryWrites=true&w=majority&appName=FSO-Phonebook`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
  favorite: Boolean,
});

const Entry = mongoose.model('Entry', entrySchema);

if (process.argv.length > 3) {

    const name = process.argv[3];
    const number = process.argv[4];
    let favorite = Math.random() < 0.5;

    if (process.argv.length >= 6) {
        favorite =process.argv[5] === "false" ? false : true;
    };

    const newEntry = new Entry({
        name: name,
        number: number,
        favorite: favorite
    });

    newEntry.save().then(result => {
        if (favorite) {
            console.log(`Added ${name}: ${number} as a favorite to the phonebook!`);
        } else {
            console.log(`Added ${name}: ${number} to the phonebook!`);
        };

        mongoose.connection.close();
    });

} else {

    Entry.find({}).then(result => {
        console.log("Current Phonebook Entries:");
        result.forEach(item => {
            if (item.favorite) {
                console.log(`${item.name}: ${item.number} is set to favorite`);
            } else {
                console.log(`${item.name}: ${item.number}`);
            };
        });
        mongoose.connection.close();
    });

};





