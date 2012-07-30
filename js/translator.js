if (!Gossamer) Gossamer = {};

Gossamer.translator = new (function() {
	
	this.toArticle = function(model, options) {
		var article = {
			__SchemaType: options.SchemaName,
			__Properties: []
		};
		
		for (var attr in (model.attributes || {})) {
			article.__Properties.push({
				"Key": attr.toLowerCase(),
				"Value": model.attributes[attr]
			});
		}
		
		return article;
	}
	
	var toNativeType = function(value) {
		if (value == 'true') return true;
		if (value == 'false') return false;
		if (parseInt(value) == value) return parseInt(value);
		if (parseFloat(value) == value) return parseFloat(value);
		if (value == 'null') return null;
		if (value == 'undefined') return undefined;
		
		return value;
	}
	
	this.fromArticle = function(article, options) {
		var model = {};
		model.id = article.__Id;
		for (var x=0;x<article.__Properties.length;x=x+1) {
			model[article.__Properties[x].Key.toLowerCase()] = toNativeType(article.__Properties[x].Value);
		}
		
		return model;
	}
	
})();