/**
Depends on  Gossamer.utils.ajax
Gossamer.utils.cookies
**/

function GossamerStorage(op) {
    var SESSION_COOKIE_NAME = 'Gossamer-session';
    var sessionServiceUrl = '/session.svc';

    var options = op || {};
    var deploymentName = options.deploymentName;
    var sessionCookie;
    var sessionId;
    var validSessionExists = false;

    if (!this instanceof GossamerStorage) {
        return new GossamerStorage();
    }

    this.urlFactory = new UrlFactory();

    this.session = {
        createSession: function (loginCredentials, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.session.getCreateSessionUrl(loginCredentials);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Code) != "undefined" && data.Code != null && data.Code == '200') {
                    if (typeof (onSuccess) == 'function')
                        onSuccess(data.SessionId);
                    Gossamer.utils.cookies.set({ name: SESSION_COOKIE_NAME, value: data.SessionId });
                } else {
                    if (typeof (onError) == 'function')
                        onError();
                }
            });
        }
    };

    //schema storage
    this.schemas = {
        exportSchemas: function (id) {
            var url = Gossamer.storage.urlFactory.schema.getExportUrl(id);

            // window.location = url;
            $('<iframe></iframe>').appendTo($(document.body)).attr('src', url).attr('id', 'tmpIFrame').css('width', '0').css('height', '0');

        },
        searchAll: function (catalogName, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.schema.getSearchAllUrl(catalogName, ['orderBy=UtcLastUpdatedDate']);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Schemas) != "undefined" && data.Schemas != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Schemas);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee, [data]);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        getProperties: function (schemaId, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.schema.getGetPropertiesUrl(schemaId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Schema) != "undefined" && data.Schema != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Schema);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee, [data]);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        update: function (schema, onSuccess, onError) {
            Gossamer.utils.ajax.post(Gossamer.storage.urlFactory.schema.getUpdateUrl(schema.Id), schema, true, function (data) {
                if (typeof (data.Schema) != "undefined" && data.Schema != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Schema);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee, [data]);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        create: function (schema, onSuccess, onError) {
            Gossamer.utils.ajax.put(Gossamer.storage.urlFactory.schema.getCreateUrl(), schema, true, function (data) {
                if (typeof (data.Schema) != "undefined" && data.Schema != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Schema);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee, [data]);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        deleteSchema: function (schemaId, onSuccess, onError) {
            Gossamer.utils.ajax.del(Gossamer.storage.urlFactory.schema.getDeleteUrl(schemaId), false, function (data) {
                if (typeof (data.Code) != "undefined" && data.Code != null && data.Code == '200') {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        addProperty: function (schemaId, property, onSuccess, onError) {
            Gossamer.utils.ajax.put(Gossamer.storage.urlFactory.schema.getAddPropertyUrl(schemaId), property, true, function (data) {
                if (typeof (data.Schema) != "undefined" && data.Schema != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Schema);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        updateProperty: function (schemaId, property, onSuccess, onError) {
            Gossamer.utils.ajax.post(Gossamer.storage.urlFactory.schema.getUpdatePropertyUrl(schemaId), property, true, function (data) {
                if (typeof (data.Schema) != "undefined" && data.Schema != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Schema);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        deleteProperty: function (schemaId, propertyId, onSuccess, onError) {
            Gossamer.utils.ajax.del(Gossamer.storage.urlFactory.schema.getDeletePropertyUrl(schemaId, propertyId), true, function (data) {
                if (typeof (data.Schema) != "undefined" && data.Schema != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Schema);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        updateAttributes: function (schema, onSuccess, onError) {
            Gossamer.utils.ajax.post(Gossamer.storage.urlFactory.schema.getUpdateAttributesUrl(schema.Id), schema.Attributes, true, function (data) {
                if (typeof (data.Schema) != "undefined" && data.Schema != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Schema);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        getSchemaRawWithProperties: function (schemaId, onSuccess, onError) {
            onSuccess = onSuccess || function () { };
            var url = Gossamer.storage.urlFactory.schema.getGetUrl(schemaId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                onSuccess(data, url);
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        }
    };

    //relation storage
    this.relations = {
        exportRelations: function (id) {
            var url = Gossamer.storage.urlFactory.relation.getExportUrl(id);

            window.location = url;
        },

        searchAll: function (catalogName, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.relation.getSearchAllUrl(catalogName);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Relations) != "undefined" && data.Relations != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Relations);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        searchBySchema: function (blueprintName, schemaName, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.relation.getSearchBySchemaUrl(blueprintName, schemaName);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Relations) != "undefined" && data.Relations != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Relations);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        getProperties: function (relationId, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.relation.getGetPropertiesUrl(relationId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Relation) != "undefined" && data.Relation != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Relation);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        create: function (relation, onSuccess, onError) {
            Gossamer.utils.ajax.put(Gossamer.storage.urlFactory.relation.getCreateUrl(), relation, true, function (data) {
                if (typeof (data.Relation) != "undefined" && data.Relation != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Relation);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee, [data]);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        update: function (relation, onSuccess, onError) {
            Gossamer.utils.ajax.post(Gossamer.storage.urlFactory.relation.getUpdateUrl(relation.Id), relation, true, function (data) {
                if (typeof (data.Relation) != "undefined" && data.Relation != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Relation);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee, [data]);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        updateEndPoint: function (relationId, endPoint, type, onSuccess, onError) {
            Gossamer.utils.ajax.post(Gossamer.storage.urlFactory.relation.getUpdateEndPointUrl(relationId, type), endPoint, true, function (data) {
                if (typeof (data.Relation) != "undefined" && data.Relation != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Relation);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee, [data]);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        deleteRelation: function (relationId, onSuccess, onError) {
            Gossamer.utils.ajax.del(Gossamer.storage.urlFactory.relation.getDeleteUrl(relationId), false, function (data) {
                if (typeof (data.Code) != "undefined" && data.Code != null && data.Code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        addProperty: function (relationId, property, onSuccess, onError) {
            Gossamer.utils.ajax.put(Gossamer.storage.urlFactory.relation.getAddPropertyUrl(relationId), property, true, function (data) {
                if (typeof (data.Relation) != "undefined" && data.Relation != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Relation);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        updateProperty: function (relationId, property, onSuccess, onError) {
            Gossamer.utils.ajax.post(Gossamer.storage.urlFactory.relation.getUpdatePropertyUrl(relationId), property, true, function (data) {
                if (typeof (data.Relation) != "undefined" && data.Relation != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Relation);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        deleteProperty: function (relationId, propertyId, onSuccess, onError) {
            Gossamer.utils.ajax.del(Gossamer.storage.urlFactory.relation.getDeletePropertyUrl(relationId, propertyId), true, function (data) {
                if (typeof (data.Relation) != "undefined" && data.Relation != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Relation);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        updateAttributes: function (relation, onSuccess, onError) {
            Gossamer.utils.ajax.post(Gossamer.storage.urlFactory.relation.getUpdateAttributesUrl(relation.Id), relation.Attributes, true, function (data) {
                if (typeof (data.Relation) != "undefined" && data.Relation != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Relation);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments[0].Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        getRelationRawWithProperties: function (relationId, onSuccess, onError) {
            onSuccess = onSuccess || function () { };
            var url = Gossamer.storage.urlFactory.relation.getGetUrl(relationId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                onSuccess(data, url);
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        }
    };

    //cannedlist storage
    this.cannedLists = {
        exportLists: function (id) {
            var url = Gossamer.storage.urlFactory.cannedList.getExportUrl(id);
            window.location = url;
        },

        exportListItems: function (id, cannedListId) {
            var url = Gossamer.storage.urlFactory.cannedList.getListItemExportUrl(id, cannedListId);
            window.location = url;
        },

        searchAll: function (catalogName, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.cannedList.getSearchAllUrl(catalogName);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Lists) != "undefined" && data.Lists != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Lists);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError();
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        getListWithItems: function (cannedListId, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.cannedList.getGetItemsUrl(cannedListId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.List) != "undefined" && data.List != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.List);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        getListItems: function (cannedListId, queryParams, onSuccess, onError) {
            Gossamer.utils.ajax.get(Gossamer.storage.urlFactory.cannedList.getSearchListItemsUrl(cannedListId, queryParams), true, function (data) {
                if (typeof (data.ListItems) != "undefined" && data.ListItems != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.ListItems);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },


        create: function (cannedList, onSuccess, onError) {
            Gossamer.utils.ajax.put(Gossamer.storage.urlFactory.cannedList.getCreateUrl(), cannedList, true, function (data) {
                if (typeof (data.List) != "undefined" && data.List != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.List);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        deleteCannedList: function (cannedListId, onSuccess, onError) {
            Gossamer.utils.ajax.del(Gossamer.storage.urlFactory.cannedList.getDeleteUrl(cannedListId), true, function (data) {
                if (typeof (data.Code) != "undefined" && data.Code != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        updateListItemPosition: function (cannedListId, currentPosition, newPosition, onSuccess, onError) {
            Gossamer.utils.ajax.get(Gossamer.storage.urlFactory.cannedList.getUpdateListItemPositionUrl(cannedListId, currentPosition, newPosition), true, function (data) {
                if (typeof (data.List) != "undefined" && data.List != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        deleteListItem: function (cannedListId, listItemName, onSuccess, onError) {
            Gossamer.utils.ajax.del(Gossamer.storage.urlFactory.cannedList.getDeleteListItemUrl(cannedListId, listItemName), true, function (data) {
                if (typeof (data.List) != "undefined" && data.List != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        addListItem: function (cannedListId, listItem, onSuccess, onError) {
            Gossamer.utils.ajax.post(Gossamer.storage.urlFactory.cannedList.getAddListItemsUrl(cannedListId), [listItem], true, function (data) {
                if (typeof (data.List) != "undefined" && data.List != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        updateListItem: function (cannedListId, oldName, listItem, onSuccess, onError) {
            Gossamer.utils.ajax.post(Gossamer.storage.urlFactory.cannedList.getUpdateListItemUrl(cannedListId, oldName), listItem, true, function (data) {
                if (typeof (data.List) != "undefined" && data.List != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        update: function (list, onSuccess, onError) {
            Gossamer.utils.ajax.post(Gossamer.storage.urlFactory.cannedList.getUpdateUrl(list.Id), list, true, function (data) {
                if (typeof (data.List) != "undefined" && data.List != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.List);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        getCannedListRawWithItems: function (listId, onSuccess, onError) {
            onSuccess = onSuccess || function () { };
            var url = Gossamer.storage.urlFactory.cannedList.getGetUrl(listId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                onSuccess(data, url);
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        }
    };

    var catalogServiceUrl = '/blueprint.svc';
    this.catalogs = {
        searchAll: function (onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.catalog.getSearchAllUrl();
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Blueprints) != "undefined" && data.Blueprints != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Blueprints);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        }
    };

    this.blueprints = {

        create: function (blueprint, onSuccess, onError) {
            Gossamer.utils.ajax.put(Gossamer.storage.urlFactory.blueprint.getCreateUrl(), blueprint, true, function (data) {
                if (typeof (data.Blueprint) != "undefined" && data.Blueprint != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Blueprint);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        getAllSchemas: function (blueprintId, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.schema.getSearchAllUrl(blueprintId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Schemas) != "undefined" && data.Schemas != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Schemas);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        getAllRelations: function (blueprintId, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.relation.getSearchAllUrl(blueprintId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Relations) != "undefined" && data.Relations != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Relations);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        getAllCannedLists: function (blueprintId, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.cannedList.getSearchAllUrl(blueprintId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Lists) != "undefined" && data.Lists != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Lists);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        }
    };

    this.deployments = {
        get: function (depId, onSuccess, onError) {
            Gossamer.utils.ajax.get(Gossamer.storage.urlFactory.deployment.getGetUrl(depId), true, function (data) {
                if (typeof (data.Deployment) != "undefined" && data.Deployment != null && data.Status != null && data.Status.Code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Deployment);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        getPublishStatus: function (refId, onSuccess, onError) {
            Gossamer.utils.ajax.get(Gossamer.storage.urlFactory.deployment.getGetPublishStatusUrl(refId), true, function (data) {
                if (data.Status != null && data.Status.Code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Log);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        create: function (deployment, onSuccess, onError) {
            Gossamer.utils.ajax.put(Gossamer.storage.urlFactory.deployment.getCreateUrl(), deployment, true, function (data) {
                if (typeof (data.DeploymentId) != "undefined" && data.DeploymentId != null && data.Status != null && data.Status.Code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        searchAll: function (onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.deployment.getFetchAllDeploymentsUrl();
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Deployments) != "undefined" && data.Deployments != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Deployments);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        getAllSchemas: function (deploymentId, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.deployment.getSearchAllSchemaUrl(deploymentId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Schemas) != "undefined" && data.Schemas != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Schemas);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        getAllRelations: function (deploymentId, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.deployment.getSearchAllRelationsUrl(deploymentId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Relations) != "undefined" && data.Relations != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Relations);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        getAllCannedLists: function (deploymentId, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.deployment.getSearchAllListsUrl(deploymentId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Lists) != "undefined" && data.Lists != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Lists);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        }
    };

    var tagsServiceUrl = '/tags.svc';
    this.tags = {
        addTag: function (type, entityId, parentEntityId, tagValue, callback) {
            Gossamer.utils.ajax.get(Gossamer.storage.urlFactory.tag.getAddTagUrl(type, entityId, parentEntityId, tagValue), true, function (data) {
                if (typeof (callback) == "function") {
                    callback(data);
                }
            }, function () {
                if (typeof (callback) == "function") {
                    callback.apply(arguments.callee);
                }
            });
        },

        removeTag: function (type, entityId, parentEntityId, tagValue, callback) {
            Gossamer.utils.ajax.get(Gossamer.storage.urlFactory.tag.getRemoveTagUrl(type, entityId, parentEntityId, tagValue), true, function (data) {
                if (typeof (callback) == "function") {
                    callback(data);
                }
            }, function () {
                if (typeof (callback) == "function") {
                    callback.apply(arguments.callee);
                }
            });
        }
    };

    this.articles = {
        exportArticles: function (id, type) {
            var url = Gossamer.storage.urlFactory.article.getExportUrl(id, type);
            window.location = url;
        },

        searchAll: function (deploymentId, schemaId, query, pageNumber, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.article.getSearchAllUrl(deploymentId, schemaId, ['orderBy=__UtcLastUpdatedDate', 'pnum=' + pageNumber, 'freetext=' + query]);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Articles) != "undefined" && data.Articles != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Articles, data.PagingInfo.TotalRecords);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        deleteArticle: function (deploymentId, articleId, schemaName, onSuccess, onError) {
            Gossamer.utils.ajax.del(Gossamer.storage.urlFactory.article.getDeleteUrl(deploymentId, articleId, schemaName), true, function (data) {
                if (typeof (data.Code) != "undefined" && data.Code != null && data.Code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        create: function (deploymentId, schemaName, article, onSuccess, onError) {
            Gossamer.utils.ajax.put(Gossamer.storage.urlFactory.article.getCreateUrl(deploymentId, schemaName), article, true, function (data) {
                if (typeof (data.Article) != "undefined" && data.Article != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Article);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        update: function (deploymentId, article, onSuccess, onError) {
            Gossamer.utils.ajax.post(Gossamer.storage.urlFactory.article.getUpdateUrl(deploymentId, article.__Id), article, true, function (data) {
                if (typeof (data.Article) != "undefined" && data.Article != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Article);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        get: function (deploymentId, schemaId, articleId, onSuccess, onError) {
            Gossamer.utils.ajax.get(Gossamer.storage.urlFactory.article.getGetUrl(deploymentId, schemaId, articleId), true, function (data) {
                if (typeof (data.Article) != "undefined" && data.Article != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Article);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments[0].Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },
        multiGet: function (deploymentId, schemaId, articleIds, onSuccess, onError) {
            Gossamer.utils.ajax.get(Gossamer.storage.urlFactory.article.getMultiGetUrl(deploymentId, schemaId, articleIds), true, function (data) {
                if (typeof (data.Articles) != "undefined" && data.Articles != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Articles);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments[0].Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        getByProperties: function (deploymentId, schemaName, filters, onSuccess, onError, isAsync) {
            var query = '(';
            for (var x = 0; x < filters.length; x = x + 1) {
                query += '*' + filters[x].key + ' == \'' + escape(filters[x].value) + '\'';
                if (x < filters.length - 1) {
                    query += ' AND ';
                }
            }
            query += ')';

            Gossamer.utils.ajax.get(Gossamer.storage.urlFactory.article.getPropertiesSearchUrl(deploymentId, schemaName, query), isAsync, function (data) {
                if (typeof (data.Articles) != "undefined" && data.Articles != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Articles);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments[0].Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        }
    };

    this.connections = {
        searchByArticle: function (deploymentId, relationId, articleId, label, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.connection.getSearchByArticleUrl(deploymentId, relationId, articleId, label, ['orderBy=__UtcLastUpdatedDate', 'pnum=1']);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Connections) != "undefined" && data.Connections != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Connections, data.PagingInfo.TotalRecords);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },
        create: function (deploymentId, relationId, connection, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.connection.getCreateUrl(deploymentId, relationId);
            Gossamer.utils.ajax.put(url, connection, true, function (data) {
                if (typeof (data.Connection) != "undefined" && data.Connection != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Connection);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.Status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },
        deleteConnection: function (deploymentId, relationId, connectionId, onSuccess, onError) {
            var url = Gossamer.storage.urlFactory.connection.getDeleteUrl(deploymentId, relationId, connectionId);
            Gossamer.utils.ajax.del(url, true, function (data) {
                if (typeof (data.Code) != "undefined" && data.Code != null && data.Code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        }
    };
}

if (!window.Gossamer) window.Gossamer = {};
if (!Gossamer.storage) Gossamer.storage = new GossamerStorage();

Gossamer.services.authenticationService.setEnvironmentData();