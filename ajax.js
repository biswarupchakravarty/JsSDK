/**
Depends on	jQuery
**/

(function ($) {
    if (!window.Genesis) {
        window.Genesis = {};
    }
    if (!Genesis.utils) {
        window.Genesis.utils = {};
    }

    window.Genesis.utils.ajax = new (function () {
        this.get = function (url, async, onSuccess, onError) {
            onError = onError || function () { };
            $.ajax({
                url: url,
                type: 'GET',
                async: async,
                success: function (data) {
                    if (window.Genesis.utils.ajax.checkStatus(data)) {
                        onSuccess(data) || function () { }
                    }
                },
                error: function () {
                    // EventManager.fire('logoutClicked', this);
                    EventManager.fire("error.show", window, { message: "Cannot connect to server." });
                    onError();
                }
            });
        };

        this.post = function (url, data, async, onSuccess, onError) {
            onError = onError || function () { };
            $.ajax({
                url: url,
                type: 'POST',
                async: async,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data) {
                    if (window.Genesis.utils.ajax.checkStatus(data)) {
                        onSuccess(data) || function () { }
                    }
                },
                error: function () {
                    // EventManager.fire('logoutClicked', this);
                    EventManager.fire("error.show", window, { message: "Cannot connect to server." });
                    onError();
                }
            });
        };

        this.put = function (url, data, async, onSuccess, onError, ignoreStatus) {
            onError = onError || function () { };
            $.ajax({
                url: url,
                type: 'PUT',
                async: async,
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (data) {
                    if (ignoreStatus) {
                        data.ignoreStatus = true;
                    }
                    if (window.Genesis.utils.ajax.checkStatus(data)) {
                        onSuccess(data) || function () { }
                    }
                },
                error: function () {
                    // EventManager.fire('logoutClicked', this);
                    EventManager.fire("error.show", window, { message: "Cannot connect to server." });
                    onError();
                }
            });
        };

        this.del = function (url, async, onSuccess, onError, ignoreStatus) {
            onError = onError || function () { };
            $.ajax({
                url: url,
                type: 'DELETE',
                async: async,
                success: function (data) {
                    if (ignoreStatus) {
                        data.ignoreStatus = true;
                    }
                    if (window.Genesis.utils.ajax.checkStatus(data)) {
                        onSuccess(data) || function () { }
                    }
                },
                error: function () {
                    // EventManager.fire('logoutClicked', this);
                    EventManager.fire("error.show", window, { message: "Cannot connect to server." });
                    onError();
                }
            });
        };

        this.checkStatus = function (data) {
            if (typeof (data) != undefined) {
                if (data.ignoreStatus) {
                    return true;
                }
                if (data.Code != undefined) {
                    if (data.Code == '8027' || data.Code == '8002' || window.sessionDown) {
                        new Genesis.views.sessionExpiredView().render(data, function () {
                            EventManager.fire('logoutClicked', this);
                        });
                        return false;
                    }
                }
                else if (data.Status != undefined) {
                    if (data.Status.Code == '8027' || data.Status.Code == '8002' || window.sessionDown) {
                        new Genesis.views.sessionExpiredView().render(data, function () {
                            EventManager.fire('logoutClicked', this);
                        });
                        return false;
                    }
                }
            }
            return true;
        };
    })();
})(jQuery)