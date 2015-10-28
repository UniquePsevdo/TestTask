var express = require('express') ;

var routes = function(Verse){
    var versesRouter = express.Router();
    versesRouter.route('/')
        .post(function(req, res){
            var verse = new Verse(req.body);
            verse.save(function(err){
                if(err){
                    console.log('Error occurred while creating new verse');
                }else{
                    res.status(201).send(verse) ;
                }
            });

        })
        .get(function(req, res){
            var query = {};
            if(req.query){
                query = req.query;
            }

            Verse.find(query, function(err, verses){
                if(err){
                    console.log('Error occurred while getting verses');
                    res.status(500).send(err);
                }else{
                    res.json(verses);
                }
            });
        });
    versesRouter.use('/:verseId', function(req, res, next){
        Verse.findById(req.params.verseId, function(err, verse){
            if(err){
                console.log('Error occurred while getting verse');
                res.status(500).send(err);
            }else if(verse){
                req.verse = verse;
                next();
            }
            else{
                res.status(404).send('no verse found');
            }
        });
    })
    versesRouter.route('/:verseId')
        .get(function(req, res){
            res.json(req.verse);
        })
        .put(function(req, res){
            req.verse.name = req.body.name;
            req.verse.numbersOfLine = req.body.numbersOfLine;
            req.verse.isLearned = req.body.isLearned;
            req.verse.author = req.body.author;
            req.verse.save(function(err){
                if(err){
                    console.log('Error occurred while updating verse');
                    res.status(500).send(err);
                }else{
                    res.json(req.verse);
                }
            });

        })
        .delete(function(req, res){
            req.verse.remove(function(err){
                if(err){
                    res.status(500).send(err);
                }else{
                    res.status(204).send('Removed');
                }
            });
        });
    ;
    return versesRouter;
};

module.exports = routes;