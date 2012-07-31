/**
 * Backbone gossamerStorage Adapter
 * https://github.com/jeromegn/Backbone.gossamerStorage
 */ (function () {
    // A simple module to replace `Backbone.sync` with *gossamerStorage*-based
    // persistence. Models are given GUIDS, and saved into a JSON object. Simple
    // as that.

    // Hold reference to Underscore.js and Backbone.js in the closure in order
    // to make things work even if they are removed from the global namespace
    var _ = this._;
    var Backbone = this.Backbone;

    // Generate four random hex digits.
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    // Generate a pseudo-GUID by concatenating random hexadecimal.
    function guid() {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };

    // Our Store is represented by a single JS object in *gossamerStorage*. Create it
    // with a meaningful name, like the name you'd give a table.
    // window.Store is deprectated, use Backbone.GossamerStorage instead
    Backbone.GossamerStorage = window.Store = function (name) {
        this.name = name;
        // var store = this.gossamerStorage().getItem(this.name);
        // this.records = (store && store.split(",")) || [];
        this.records = [];
    };

    _.extend(Backbone.GossamerStorage.prototype, {

        // Save the current state of the **Store** to *gossamerStorage*.
        save: function (newAttributes) {
        },

        // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
        // have an id of it's own.
        create: function (model, success) {
            // send create article call for the schema in the .name property
            var doNothing = function () {};
            var options = {
                SchemaName: this.name
            };
            model = Gossamer.translator.toArticle(model, options);
            var that = this;
            Gossamer.storage.articles.create(4152, this.name, model, function (article) {
                var model = Gossamer.translator.fromArticle(article);
                that.records.push(model);
                // that.save();
                (success || function () {})(model);
                return model;
            }, doNothing);
            return;
            if (!model.id) {
                model.id = guid();
                model.set(model.idAttribute, model.id);
            }
            this.gossamerStorage().setItem(this.name + "-" + model.id, JSON.stringify(model));
            this.records.push(model.id.toString());
            this.save();
            return model.toJSON();
        },

        // Update a model by replacing its copy in `this.data`.
        update: function (model, success) {
			var doNothing = function() {};
			
			// pull old copy from model
			var old = null;
			for (var x=0;x<this.records.length;x=x+1) {
				if (this.records[x].id == model.id) {
					old = this.records[x];
					break;
				}
			}
			
			// find diff
			var changed = [];
			var deleted = [];
			var mAttrs = model.attributes;
			
			var command = {
				"UpdateCommands": [
					{
						"__type": "UpdatePropertiesCommand:http://www.tavisca.com/gossamer/datacontracts/2011/11",
						"PropertiesToAddOrUpdate": [],
						"PropertiesToRemove": []
					}
				]
			};
			
			for (var attr in old) {
				if (typeof(mAttrs[attr]) == undefined && typeof(old[attr]) != undefined) {
					// deleted.push(attr);
					command.UpdateCommands[0].PropertiesToRemove.push(attr);
				} else if (old[attr] != mAttrs[attr]) {
					// changed.push({'key': attr, 'value': mAttrs[attr]});
					command.UpdateCommands[0].PropertiesToAddOrUpdate.push({'Key': attr, 'Value': mAttrs[attr]});
				}
			}
			
			var that = this;
			Gossamer.storage.articles.update(4152, this.name, model.id, command, function(article) {
				var model = Gossamer.translator.fromArticle(article);
				if (!_.include(that.records, model.id.toString())) that.records.push(model.id.toString());
				success(model);
			}, doNothing);
			
			return;
			
            this.gossamerStorage().setItem(this.name + "-" + model.id, JSON.stringify(model));
            if (!_.include(this.records, model.id.toString())) this.records.push(model.id.toString());
            this.save();
            return model.toJSON();
        },

        // Retrieve a model from `this.data` by id.
        find: function (model) {
            // send get article call
            return {};
            return JSON.parse(this.gossamerStorage().getItem(this.name + "-" + model.id));
        },

        // Return the array of all models currently in storage.
        findAll: function (success) {
            // reset records
            this.records.length = 0;

            var doNothing = function () {};
            var records = this.records;
            var options = {
                SchemaName: this.name
            };
            Gossamer.storage.articles.searchAll(4152, this.name, '', 1, function (articles, totalRecords) {
                for (var x = 0; x < articles.length; x = x + 1) {
                    records.push(Gossamer.translator.fromArticle(articles[x]));
                }
                success(records);
            }, doNothing);

            return;

            return _(this.records).chain().map(function (id) {
                return JSON.parse(this.gossamerStorage().getItem(this.name + "-" + id));
            }, this).compact().value();
        },

        // Delete a model from `this.data`, returning it.
        destroy: function (model, success) {
            // send article delete call
            var options = {
                SchemaName: this.name
            };
            var doNothing = function () {};
            var that = this;
            Gossamer.storage.articles.deleteArticle(4152, model.id, this.name, function () {
                that.records = _.reject(that.records, function (record) {
                    return record.id == model.id.toString();
                });
				
				// success callback
				success();
            }, doNothing);

            return;

            this.gossamerStorage().removeItem(this.name + "-" + model.id);
            this.records = _.reject(this.records, function (record_id) {
                return record_id == model.id.toString();
            });
            this.save();
            return model;
        },

        gossamerStorage: function () {
            return Gossamer.storage;
        }

    });

    // gossamerSync delegate to the model or collection's
    // *gossamerStorage* property, which should be an instance of `Store`.
    // window.Store.sync and Backbone.gossamerSync is deprectated, use Backbone.GossamerStorage.sync instead
    Backbone.GossamerStorage.sync = window.Store.sync = Backbone.gossamerSync = function (method, model, options, error) {
        var store = model.gossamerStorage || model.collection.gossamerStorage;
        if (!Gossamer.authentication.getSessionId()) {
            Gossamer.init();
        }
        // Backwards compatibility with Backbone <= 0.3.3
        if (typeof options == 'function') {
            options = {
                success: options,
                error: error || function () {}
            };
        }

        var resp;
        var onSuccess = options.success || function () {};
        switch (method) {
        case "read":
            resp = model.id != undefined ? store.find(model) : store.findAll(onSuccess);
            break;
        case "create":
            resp = store.create(model, onSuccess);
            break;
        case "update":
            resp = store.update(model, onSuccess);
            break;
        case "delete":
            resp = store.destroy(model, onSuccess);
            break;
        }

        if (resp) {
            options.success(resp);
        } else {
            options.error("Record not found");
        }
    };

    Backbone.ajaxSync = Backbone.sync;

    Backbone.getSyncMethod = function (model) {
        if (model.gossamerStorage || (model.collection && model.collection.gossamerStorage)) {
            return Backbone.gossamerSync;
        }

        return Backbone.ajaxSync;
    };

    // Override 'Backbone.sync' to default to gossamerSync,
    // the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
    Backbone.sync = function (method, model, options, error) {
        return Backbone.getSyncMethod(model).apply(this, [method, model, options, error]);
    };

})();