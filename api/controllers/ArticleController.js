/**
 * ArticleController
 *
 * @description :: Server-side logic for managing articles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var flashService = require('../services/FlashService.js');

module.exports = {
	
	list : function (req, res, next) 
	{
		Article.find().populate('creator').exec(function (err, articles) {
			if (err) {
				flashService.setMessage('warning','Error al consultar los articulos');
            	return res.redirect('/');	
			}

			return res.json(articles);
		})
	},

	findOne : function(req, res, next) 
	{
		Article.find({id:req.param('articleId')}).populate('creator').exec(function (err, article) {
			if (err) {
				flashService.setMessage('warning','Ocurrio un error al buscar el articulo');
            	return res.redirect('/');		
			}

			if(!article) {
				flashService.setMessage('warning','No se encontro el articulo');
            	return res.redirect('/');			
			}			
			return res.send(JSON.stringify(article));
		});
	},

	create : function (req, res, next) 
	{		

		var articleData = {
            title : req.param('title'),
            content : req.param('content'),
            creator : req.session.User.id
        };

        Article.create(articleData, function (err, article) {
            if (err) {
            	flashService.setMessage('warning','Error al crear el articulo');
            	return res.redirect('/');
            }

            res.json(article);
        });
	},


	update : function (req, res, next) 
	{
		var articleData = {
            title : req.param('title'),
            content : req.param('content')            
        };        

        Article.update({id : req.param('articleId')}, articleData).exec(function (err, update) {
        	if (err) {
        		flashService.setMessage('warning','Error al actualizar el articulo');
            	return res.redirect('/');		
        	}       		
        });
	},

	delete : function (req, res, next) 
	{
		Article.destroy({id : req.param('articleId')}).exec(function (err) {
			if (err) {
        		flashService.setMessage('warning','Error al eliminar el articulo');
            	return res.redirect('/');		
        	}else{
        		return res.redirect('/');
        	}
		});
	},		
};


