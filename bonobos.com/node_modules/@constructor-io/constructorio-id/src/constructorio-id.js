(function () {
  // Object.assign polyfill
  // - https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
  Object.assign || Object.defineProperty(Object, 'assign', {enumerable: !1, configurable: !0, writable: !0, value: function (e) {'use strict'; if (void 0 === e || e === null) throw new TypeError('Cannot convert first argument to object'); for (var r = Object(e), t = 1; t < arguments.length; t++) {var n = arguments[t]; if (void 0 !== n && n !== null) {n = Object(n); for (var o = Object.keys(Object(n)), a = 0, c = o.length; c > a; a++) {var i = o[a], b = Object.getOwnPropertyDescriptor(n, i); void 0 !== b && b.enumerable && (r[i] = n[i]);}}} return r;}}); // eslint-disable-line

  var ConstructorioID = function (options) {
    var defaults = {
      user_agent: null,
      persist: true,
      cookie_name_client_id: 'ConstructorioID_client_id',
      cookie_name_session_id: 'ConstructorioID_session_id',
      cookie_name_session_data: 'ConstructorioID_session',
      cookie_domain: null,
      cookie_days_to_live: 365,
      local_name_client_id: '_constructorio_search_client_id',
      local_name_session_id: '_constructorio_search_session_id',
      local_name_session_data: '_constructorio_search_session',
      on_node: typeof window === 'undefined',
      session_is_new: null,
      client_id_storage_location: 'cookie',
      session_id_storage_location: 'local'
    };

    Object.assign(this, defaults, options);

    if (!this.client_id) {
      if (!this.on_node && this.persist) {
        var persisted_id;

        if (this.client_id_storage_location === 'cookie') {
          persisted_id = this.get_cookie(this.cookie_name_client_id);
        }

        if (this.client_id_storage_location === 'local') {
          persisted_id = this.get_local_object(this.local_name_client_id);
        }

        this.client_id = persisted_id ? persisted_id : this.generate_client_id();
      } else {
        this.client_id = this.generate_client_id();
      }
    }

    if (!this.session_id) {
      if (!this.on_node && this.persist) {
        this.session_id = this.generate_session_id();
      } else {
        this.session_id = 1;
      }
    }

    if (!this.on_node) {
      this.user_agent = this.user_agent || (window && window.navigator && window.navigator.userAgent);
    }
  };

  ConstructorioID.prototype.set_cookie = function (name, value) {
    if (!this.on_node && this.persist) {
      var expires = new Date(Date.now() + this.cookie_days_to_live * 24 * 60 * 60 * 1000);
      var cookie_data = name + '=' + value + '; expires=' + expires.toUTCString() + '; path=/';
      if (this.cookie_domain) {
        cookie_data += '; domain=' + this.cookie_domain;
      }
      document.cookie = cookie_data;

      // For testing purposes
      return cookie_data;
    }

    return null;
  };

  ConstructorioID.prototype.get_cookie = function (name) {
    var cookieName = name + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieBits = decodedCookie.split(';');
    for (var i = 0; i < cookieBits.length; i++) {
      var thisCookie = cookieBits[i];
      while (thisCookie.charAt(0) === ' ') { // remove leading spaces
        thisCookie = thisCookie.substring(1);
      }
      if (thisCookie.indexOf(cookieName) === 0) {
        return thisCookie.substring(cookieName.length, thisCookie.length);
      }
    }
    return undefined; // eslint-disable-line
  };

  ConstructorioID.prototype.delete_cookie = function (name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  ConstructorioID.prototype.generate_client_id = function () {
    var client_id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });

    if (this.client_id_storage_location === 'cookie') {
      this.set_cookie(this.cookie_name_client_id, client_id);
    }

    if (this.client_id_storage_location === 'local') {
      this.set_local_object(this.local_name_client_id, client_id);
    }

    return client_id;
  };

  ConstructorioID.prototype.get_local_object = function (key) {
    var data;
    var localStorage = window && window.localStorage;
    if (localStorage && typeof key  === 'string') {
      try {
        data = JSON.parse(localStorage.getItem(key));
      } catch (e) {
        data = localStorage.getItem(key);
      }
    }
    return data;
  };

  ConstructorioID.prototype.set_local_object = function (key, data) {
    var localStorage = window && window.localStorage;

    if (localStorage && typeof key === 'string') {
      if (typeof data === 'object') {
        try {
          localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
          // fail silently
        }
      }

      if (typeof data === 'string' || typeof data === 'number') {
        try {
          localStorage.setItem(key, data);
        } catch (e) {
          // fail silently
        }
      }
    }
  };

  ConstructorioID.prototype.generate_session_id = function () {
    var now = Date.now();
    var thirtyMinutes = 1000 * 60 * 30;
    var sessionData;

    if (this.session_id_storage_location === 'local') {
      sessionData = this.get_local_object(this.local_name_session_data);
    }

    if (this.session_id_storage_location === 'cookie') {
      sessionData = this.get_cookie(this.cookie_name_session_data);

      try {
        sessionData = JSON.parse(sessionData);
      } catch (e) {
        // fail silently
      }
    }

    var sessionId = 1;
    var sessionDataId = 1;

    if (sessionData && typeof sessionData === 'object') {
      sessionDataId = parseInt(sessionData.sessionId, 10) || 1;

      if (sessionData.lastTime > now - thirtyMinutes) {
        sessionId = sessionDataId;
      } else {
        sessionId = sessionDataId + 1;
      }
    }

    this.session_id = sessionId;
    this.session_is_new = sessionData && sessionDataId === sessionId ? false : true;

    if (this.session_id_storage_location === 'local') {
      this.set_local_object(this.local_name_session_id, sessionId);
      this.set_local_object(this.local_name_session_data, {
        sessionId: sessionId,
        lastTime: now
      });
    }

    if (this.session_id_storage_location === 'cookie') {
      this.set_cookie(this.cookie_name_session_id, sessionId);
      this.set_cookie(this.cookie_name_session_data, JSON.stringify({
        sessionId: sessionId,
        lastTime: now
      }));
    }

    return sessionId;
  };

  // export module for node or environments with module loaders, such as webpack
  if (typeof module !== 'undefined' && typeof require !== 'undefined') {
    module.exports = ConstructorioID;
  }
})();
