/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 */
app.views.login = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing login view');
    },

    /** submit event for login **/
    events: {
        'submit':                   'login'
    },

    login_home: function() {
        app.routers.router.prototype.index();
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());
        /** validate form **/
        this.$("#loginForm").validate({
            rules: {
                username: {
                    required: true,
                    maxlength: 12
                },
                password: {
                    required: true,
                    maxlength: 12
                }
            },
            messages: {
                username: "Campo obbligatorio",
                password: {
                    required: "Campo obbligatorio",
                    maxlength: "Massimo 12 caratteri"
                }
            }
        });
        return this;
    },

    /** login **/
    login: function (event) {
    	
    	console.log('login button start');
    	console.log('url : ' + app.const.apiurl() + "login");
    	
        //event.preventDefault();

        var xhr = $.ajax({
            type: "POST",
            url: app.const.apiurl() + "login",
            data: this.login_formToModel(),
            crossDomain: true,
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
            dataType: "json",
            contentType: 'application/json',
            
            cache: false,
            async: false,
            timeout: 5000
            
        });
        
        xhr.done(function(data, textStatus, jqXHR) {
        	console.log('done');
            if (data.success) {
            	console.log('success');
                var _model = new app.models.user(data.user);
                app.global.usersCollection.add(_model);
                _model.save();

                app.routers.router.prototype.dashboard();
            }
            else {
                alert('error: ' + data.error);
            }
        });

        xhr.fail(function(jqXHR, textStatus) {
            alert('error: ' + textStatus);
        });
        
    },

    /** render login form data to user model **/
    login_formToModel: function() {
        var jsonObj = {};
        jsonObj = JSON.stringify({
            "username": $('#username').val(),
            "password": $('#password').val()
        });
        return jsonObj;
    }
});
