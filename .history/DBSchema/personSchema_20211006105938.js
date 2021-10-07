const mongooseSchema = require('mongoose').Schema;

const uniqueValidator = require('unique-validator');

const personSchema = new mongooseSchema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
  },
  phone: {
    type: String,
    minLength: 5,
  },
  street: {
    type: String,
    required: true,
    minLength: 5,
  },
  city: {
    type: String,
    required: true,
    minLength: 3,
  },
});

personSchema.plugin(uniqueValidator);

module.exports = Mongoose.model('Person', personSchema);
