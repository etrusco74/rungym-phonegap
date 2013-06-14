/**
 * Created with JetBrains WebStorm.
 * User: a.demarchi
 * Date: 17/04/13
 * Time: 14.55
 * To change this template use File | Settings | File Templates.
 *
 */
app.views.send = Backbone.View.extend({

    /** init view **/
    initialize: function() {
        console.log('initializing send view');
    },

    /** click event for start training **/
    events: {
        'click #btnSend':           'send',
        'click #btnDelete':         'send_delete',
        'click #btnDashboard':      'send_dashboard'
    },

    send_dashboard: function() {
        app.routers.router.prototype.dashboard();
    },

    /** render template **/
    render: function() {
        $(this.el).html(this.template());
        this.$("#numTraining").html('Attenzione, ci sono ' + app.global.trainingsCollection.length + ' allenamenti da trasferire' );
        this.$("#btnSend").html('trasferisci all. del ' + app.global.trainingsCollection.first().get("start_date") );
        this.$("#btnDelete").html('elimina all. del ' + app.global.trainingsCollection.first().get("start_date") );
        //this.send_modelToForm();
        return this;
    },

    send: function() {
        var xhr = $.ajax({
            type: "POST",
            url: app.const.apiurl() + "training",
            data: JSON.stringify(app.global.trainingsCollection.first().attributes),
            crossDomain: true,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "authkey" : app.global.usersCollection.at(0).get("auth").authkey
            },
            dataType: "json",
            contentType: 'application/json'
        });

        xhr.done(function(data, textStatus, jqXHR) {
            if (data.success) {
                //app.global.trainingsCollection.remove( app.global.trainingsCollection.first() );
                var _model = app.global.trainingsCollection.first();
                _model.destroy();

                alert('Allenamento trasferito');
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


    /** render trainings model data to select **/
    send_modelToForm: function() {
        var _model =  app.global.trainingsCollection.models;
        $('#trainingList li').remove();
        for( var i=0 in _model ) {
            this.$('#trainingList')
                .append('<li  class=\"trainingList\">Allenamento del ' + _model[i].get("start_date") + ' <a href="#send" data-identity="' + _model[i].get("id") + '">trasferisci</a><a href="#send" data-identity="' + _model[i].get("id") + '">cancella</a></li>');
        }
    },

    send_delete: function() {
        var _model = app.global.trainingsCollection.first();
        _model.destroy();
        app.routers.router.prototype.send();
    },

    destroy_view: function() {
        this.undelegateEvents();
        $(this.el).removeData().unbind();
        this.remove();
        Backbone.View.prototype.remove.call(this);
        app.global.sendView = null;
    }
});
