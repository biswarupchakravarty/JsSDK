function UrlFactory() {

	var gossamerUrl = 'http://qa-gossamer.tavisca.com/v0.9/Core';

    this.session = {

        sessionServiceUrl: '/account.svc',

        getCreateSessionUrl: function (deploymentName) {
            return String.format(gossamerUrl + "{0}/session", this.sessionServiceUrl);
        },

        getDeleteSessionUrl: function (deploymentName) {
            return String.format("{0}/delete?deploymentName={1}", this.sessionServiceUrl, deploymentName);
        }
    };

    this.article = {
        articleServiceUrl: gossamerUrl + '/article.svc',

        getExportUrl: function (id, type) {
            return 'Articles.exp?ctype=Article&blueprintid=' + id + '&type=' + type;
        },

        getEntityId: function () {
            return Gossamer.bag.selectedCatalog.Id;
        },
        getGetUrl: function (deploymentId, schemaId, articleId) {
            return String.format('{0}/{1}/{2}/{3}', this.articleServiceUrl, deploymentId, schemaId, articleId);
        },
        getMultiGetUrl: function (deploymentId, schemaId, articleIds) {
            return String.format('{0}/multiGet/{1}/{2}/{3}', this.articleServiceUrl, deploymentId, schemaId, articleIds);
        },
        getBlobUploadUrl: function () {
            return String.format('{0}/blob/upload?deploymentid={1}', this.articleServiceUrl, this.getEntityId());
        },
        getBlobUpdateUrl: function () {
            return String.format('{0}/blob/update?deploymentid={1}', this.articleServiceUrl, this.getEntityId());
        },

        getSearchAllUrl: function (deploymentId, schemaId, queryParams) {
            var url = '';

            url = String.format('{0}/{1}/{2}/find/all', this.articleServiceUrl, deploymentId, schemaId);

            url = url + '?psize=200';
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        },
        getPropertiesSearchUrl: function (deploymentId, schemaName, query) {
            var url = String.format('{0}/search/{1}/{2}/all', this.articleServiceUrl, deploymentId, schemaName);
            url += '?properties=' + query;

            return url;
        },
        getDeleteUrl: function (deploymentId, articleId, schemaName) {
            return String.format('{0}/{1}/{2}/{3}', this.articleServiceUrl, deploymentId, schemaName, articleId);
        },
        getCreateUrl: function (deploymentId, schemaName) {
            return String.format('{0}/{1}/{2}', this.articleServiceUrl, deploymentId, schemaName);
        },
        getUpdateUrl: function (deploymentId, schemaName, articleId) {
            return String.format('{0}/{1}/{2}/{3}', this.articleServiceUrl, deploymentId, schemaName, articleId);
        }
    };

    this.connection = {
        connectionServiceUrl: '/connection.svc',

        getEntityId: function () {
            return Gossamer.bag.selectedCatalog.Id;
        },
        getCreateUrl: function (deploymentId, relationId) {
            return String.format('{0}/create/{1}/{2}', this.connectionServiceUrl, deploymentId, relationId);
        },
        getDeleteUrl: function (deploymentId, relationId, connectionId) {
            return String.format('{0}/{1}/{2}/{3}', this.connectionServiceUrl, deploymentId, relationId, connectionId);
        },
        getSearchByArticleUrl: function (deploymentId, relationId, articleId, label, queryParams) {
            var url = '';

            url = String.format('{0}/search/{1}/{2}/{3}/{4}', this.connectionServiceUrl, deploymentId, relationId, articleId, label);

            url = url + '?psize=1000';
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        }
    };

    this.schema = {

        schemaServiceUrl: '/schema.svc',

        //Return  blueprint Id or deployments blueprint Id
        getEntityId: function () {
            if (Gossamer.bag.selectedType == 'deployment') {
                return Gossamer.bag.selectedCatalog.BlueprintId;
            }
            return Gossamer.bag.selectedCatalog.Id;
        },

        getExportUrl: function (id) {
            return 'Schemas.exp?ctype=Schema&blueprintid=' + id;
        },



        getSearchAllUrl: function (catalogName, queryParams) {
            var url = '';
            if (catalogName) {
                url = String.format('{0}/find/all/{1}', this.schemaServiceUrl, catalogName);
            }
            url = url + '?psize=200';
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        },

        getGetPropertiesUrl: function (schemaId) {
            return String.format('{0}/get/{1}/{2}', this.schemaServiceUrl, this.getEntityId(), schemaId);
        },

        getCreateUrl: function () {
            return String.format('{0}/create/{1}', this.schemaServiceUrl, this.getEntityId());
        },

        getDeleteUrl: function (schemaId) {
            return String.format('{0}/delete/{1}/{2}', this.schemaServiceUrl, this.getEntityId(), schemaId);
        },

        getUpdateUrl: function (schemaId) {
            return String.format('{0}/update/{1}/{2}', this.schemaServiceUrl, this.getEntityId(), schemaId);
        },

        getUpdateAttributesUrl: function (schemaId) {
            return String.format('{0}/updateAttributes/{1}/{2}', this.schemaServiceUrl, this.getEntityId(), schemaId);
        },

        getAddPropertyUrl: function (schemaId) {
            return String.format('{0}/addProperty/{1}/{2}', this.schemaServiceUrl, this.getEntityId(), schemaId);
        },

        getDeletePropertyUrl: function (schemaId, propertyId) {
            return String.format('{0}/deleteProperty/{1}/{2}/{3}', this.schemaServiceUrl, this.getEntityId(), schemaId, propertyId);
        },

        getUpdatePropertyUrl: function (schemaId) {
            return String.format('{0}/updateProperty/{1}/{2}', this.schemaServiceUrl, this.getEntityId(), schemaId);
        },

        getGetUrl: function (schemaId) {
            var eId = Gossamer.bag.selectedType == 'blueprint' ? Gossamer.bag.selectedCatalog.Id : Gossamer.bag.selectedCatalog.BlueprintId;
            return String.format('{0}/get/{1}/{2}', this.schemaServiceUrl, eId, schemaId);
        }
    };

    this.relation = {

        relationServiceUrl: '/relation.svc',

        //Return  blueprint Id or deployments blueprint Id
        getEntityId: function () {
            if (Gossamer.bag.selectedType == 'deployment') {
                return Gossamer.bag.selectedCatalog.BlueprintId;
            }
            return Gossamer.bag.selectedCatalog.Id;
        },

        getExportUrl: function (id) {
            return 'Relations.exp?ctype=Relation&blueprintid=' + id;
        },

        getSearchBySchemaUrl: function (blueprintName, schemaName, queryParams) {
            var url = '';
            url = String.format('{0}/{1}/find/{2}', this.relationServiceUrl, blueprintName, schemaName);
            url = url + '?psize=200';
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        },

        getSearchAllUrl: function (catalogName, queryParams) {
            var url = '';
            if (catalogName) {
                url = String.format('{0}/find/all/{1}', this.relationServiceUrl, catalogName);
            }
            url = url + '?psize=200';
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        },

        getGetPropertiesUrl: function (relationId) {
            return String.format('{0}/get/{1}/{2}', this.relationServiceUrl, this.getEntityId(), relationId);
        },

        getCreateUrl: function () {
            return String.format('{0}/create/{1}', this.relationServiceUrl, this.getEntityId());
        },

        getDeleteUrl: function (relationId) {
            return String.format('{0}/delete/{1}/{2}', this.relationServiceUrl, this.getEntityId(), relationId);
        },

        getUpdateUrl: function (relationId) {
            return String.format('{0}/update/{1}/{2}', this.relationServiceUrl, this.getEntityId(), relationId);
        },

        getUpdateAttributesUrl: function (relationId) {
            return String.format('{0}/updateAttributes/{1}/{2}', this.relationServiceUrl, this.getEntityId(), relationId);
        },

        getAddPropertyUrl: function (relationId) {
            return String.format('{0}/addProperty/{1}/{2}', this.relationServiceUrl, this.getEntityId(), relationId);
        },

        getDeletePropertyUrl: function (relationId, propertyId) {
            return String.format('{0}/deleteProperty/{1}/{2}/{3}', this.relationServiceUrl, this.getEntityId(), relationId, propertyId);
        },

        getUpdatePropertyUrl: function (relationId) {
            return String.format('{0}/updateProperty/{1}/{2}', this.relationServiceUrl, this.getEntityId(), relationId);
        },

        getUpdateEndPointUrl: function (relationId, type) {
            return String.format('{0}/updateEndpoint/{1}/{2}/{3}', this.relationServiceUrl, this.getEntityId(), relationId, type);
        },

        getGetUrl: function (relationId) {
            var eId = Gossamer.bag.selectedType == 'blueprint' ? Gossamer.bag.selectedCatalog.Id : Gossamer.bag.selectedCatalog.BlueprintId;
            return String.format('{0}/get/{1}/{2}', this.relationServiceUrl, eId, relationId);
        }
    };

    this.cannedList = {

        cannedListServiceUrl: '/list.svc',

        //Return  blueprint Id or deployments blueprint Id
        getEntityId: function () {
            if (Gossamer.bag.selectedType == 'deployment') {
                return Gossamer.bag.selectedCatalog.BlueprintId;
            }
            return Gossamer.bag.selectedCatalog.Id;
        },

        getExportUrl: function (id) {
            return 'CannedLists.exp?ctype=List&blueprintid=' + id;
        },

        getListItemExportUrl: function (id, cannedListId) {
            return 'CannedLists.exp?ctype=ListItems&blueprintid=' + id + '&type=' + cannedListId;
        },

        getSearchAllUrl: function (catalogName, queryParams) {
            var url = '';
            if (catalogName) {
                url = String.format('{0}/find/all/{1}', this.cannedListServiceUrl, catalogName);
            }
            url = url + '?psize=200';
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        },

        getGetItemsUrl: function (cannedListId) {
            return String.format('{0}/get/{1}/{2}', this.cannedListServiceUrl, this.getEntityId(), cannedListId);
        },

        getCreateUrl: function () {
            return String.format('{0}/create/{1}', this.cannedListServiceUrl, this.getEntityId());
        },

        getDeleteUrl: function (cannedListId) {
            return String.format('{0}/delete/{1}/{2}', this.cannedListServiceUrl, this.getEntityId(), cannedListId);
        },

        getSearchListItemsUrl: function (cannedListId, queryParams) {
            var url = String.format('{0}/searchListItems/{1}/{2}', this.cannedListServiceUrl, this.getEntityId(), cannedListId);
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                url = url + '?';
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    url = url + queryParams[i] + "&";
                }
                url = url.substring(0, url.length - 1);
            }
            return url;
        },

        getUpdateListItemPositionUrl: function (cannedListId, currentPosition, newPosition) {
            return String.format('{0}/updateListItemPosition/{1}/{2}/{3}/{4}', this.cannedListServiceUrl, this.getEntityId(), cannedListId, currentPosition, newPosition);
        },

        getDeleteListItemUrl: function (cannedListId, listItemName) {
            return String.format('{0}/removeListItem/{1}/{2}/{3}', this.cannedListServiceUrl, this.getEntityId(), cannedListId, listItemName);
        },

        getAddListItemsUrl: function (cannedListId) {
            return String.format('{0}/addListItems/{1}/{2}', this.cannedListServiceUrl, this.getEntityId(), cannedListId);
        },

        getUpdateListItemUrl: function (cannedListId, oldName) {
            return String.format('{0}/updateListItem/{1}/{2}/{3}', this.cannedListServiceUrl, this.getEntityId(), cannedListId, oldName);
        },

        getUpdateUrl: function (listId) {
            return String.format('{0}/update/{1}/{2}', this.cannedListServiceUrl, this.getEntityId(), listId);
        },

        getGetUrl: function (relationId) {
            var eId = Gossamer.bag.selectedType == 'blueprint' ? Gossamer.bag.selectedCatalog.Id : Gossamer.bag.selectedCatalog.BlueprintId;
            return String.format('{0}/get/{1}/{2}', this.cannedListServiceUrl, eId, relationId);
        }

    };

    this.catalog = {

        catalogServiceUrl: '/blueprint.svc',

        getSearchAllUrl: function (queryParams) {
            var url = String.format('{0}/find/all?', this.catalogServiceUrl);
            url = url + '?psize=1000';
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        }
    };

    this.blueprint = {

        blueprintServiceUrl: '/blueprint.svc',

        getCreateUrl: function () {
            return String.format('{0}/create', this.blueprintServiceUrl);
        },

        getSchemasUrl: function (bId) {
            var url = String.format('{0}/getSchemas/{1}?', this.blueprintServiceUrl, bId);
            url = url + '?psize=1000';
            return url
        },

        getRelationsUrl: function (bId) {
            var url = String.format('{0}/{1}/contents/relations?', this.blueprintServiceUrl, bId);
            url = url + '?psize=10';
            return url;
        },

        getCannedListsUrl: function (bId) {
            var url = String.format('{0}/{1}/contents/lists?', this.blueprintServiceUrl, bId);
            url = url + '?psize=1000';
            return url;
        }
    };

    this.deployment = {

        deploymentServiceUrl: '/deployment.svc',

        getGetUrl: function (id) {
            return String.format('{0}/get/{1}', this.deploymentServiceUrl, id);
        },

        getGetPublishStatusUrl: function (refId, onSuccess, onError) {
            return String.format('{0}/status/{1}', this.deploymentServiceUrl, refId);
        },

        getCreateUrl: function () {
            return String.format('{0}/create', this.deploymentServiceUrl);
        },

        getFetchAllDeploymentsUrl: function () {
            var url = String.format('{0}/fetchAll', this.deploymentServiceUrl);
            url = url + '?psize=1000';
            return url;
        },

        getSearchAllSchemaUrl: function (dId) {
            var url = String.format('{0}/getSchemas/{1}', this.deploymentServiceUrl, dId);
            url = url + '?psize=1000';
            return url;
        },

        getSearchAllRelationsUrl: function (dId) {
            var url = String.format('{0}/getRelations/{1}', this.deploymentServiceUrl, dId);
            url = url + '?psize=1000';
            return url;
        },

        getSearchAllListsUrl: function (dId) {
            var url = String.format('{0}/getLists/{1}', this.deploymentServiceUrl, dId);
            url = url + '?psize=1000';
            return url;
        }
    };

    this.tag = {

        tagServiceUrl: '/tags.svc',

        //Return  blueprint Id or deployments blueprint Id
        getEntityId: function () {
            if (Gossamer.selectedType == 'deployment') {
                return Gossamer.bag.selectedCatalog.BlueprintId;
            }
            return Gossamer.bag.selectedCatalog.Id;
        },

        getAddTagUrl: function (type, entityId, parentEntityId, tagValue) {
            return String.format("{0}/addTag/{1}/{2}/{3}/{4}?tag={5}", this.tagServiceUrl, this.getEntityId(), type, entityId, parentEntityId, tagValue);
        },

        getRemoveTagUrl: function (type, entityId, parentEntityId, tagValue) {
            return String.format("{0}/removeTag/{1}/{2}/{3}/{4}?tag={5}", this.tagServiceUrl, this.getEntityId(), type, entityId, parentEntityId, tagValue);
        }
    };

    this.account = {
        accountServiceUrl: '/account.svc',

        getCreateNewAccountUrl: function () {
            return this.accountServiceUrl + '/create';
        },

        getAccountIdUrl: function (accName) {
            return this.accountServiceUrl + '/accountId/' + accName;
        }
    };

}
