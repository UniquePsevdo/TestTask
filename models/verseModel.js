var mongoose = require('mongoose'),
    VerseSchema = mongoose.Schema ;

var verseModel = new VerseSchema({
    name: {
        type: String,
        default: ''
    },
    author: {
        type: String,
        default: ''
    },
    numbersOfLine: {
        type: Number,
        default: ''
    },
    isLearned: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Verse', verseModel);