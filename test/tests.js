/*global Ember, test, ok,equal,throws,expect,start,asyncTest*/

module('Ember.InfiniteScroll Namespace');

test('InfiniteScroll namespace should exist', function(){
  ok(Ember.InfiniteScroll, 'Ember.InfiniteScroll exists');
});

test('InfiniteScroll.ControllerMixin namespace should exist', function(){
  ok(Ember.InfiniteScroll.ControllerMixin);
});

test('InfiniteScroll.RouteMixin namespace should exist', function(){
  ok(Ember.InfiniteScroll.RouteMixin);
});

test('InfiniteScroll.ViewMixin namespace should exist', function(){
  ok(Ember.InfiniteScroll.ViewMixin);
});

module('Ember.InfiniteScroll route actions', function(){
});

test('has actions infinite.getMore and infinite.fetchPage', function(){
  var InfiniteRoute = Ember.Route.extend(Ember.InfiniteScroll.RouteMixin),
      route;

  Ember.run(function(){
    route = InfiniteRoute.create();
  });

  ok(route);
  ok(route._actions['infinite.getMore']);
  ok(route._actions['infinite.fetchPage']);
});

test('can call infinite.getMore', function(){
  Ember.testing = true;

  var App;
  Ember.run(function(){
    App = Ember.Application.create();
    App.setupForTesting();
  });

  var InfiniteController = Ember.Controller.extend(Ember.InfiniteScroll.ControllerMixin),
      controller;
  var InfiniteRoute = Ember.Route.extend(Ember.InfiniteScroll.RouteMixin),
      route;
  var container = App.__container__;

  Ember.run(function(){
    container.register('route:application', InfiniteRoute);
    container.register('controller:application', InfiniteController);
    container.injection('controller:application', 'target', 'route:application');

    route = container.lookup('route:application');
    controller = container.lookup('controller:application');
    App.advanceReadiness();
  });

  equal(controller.get('target'), route, 'controller target is route');

  Ember.run(function(){
    throws(function(){
      controller.send('infinite.getMore');
    },
    /must override/i,
    'throws override error');
  });

  Ember.run(function(){
    throws(function(){
      controller.send('infinite.fetchPage');
    },
    /must override/i,
    'throws override error');
  });
});

var view;
module('Ember.InfiniteScroll View Mixins', {
  setup: function(){
    $('#qunit-fixture').addClass('scrollable');
  },
  teardown: function(){
    if (view) {
      Ember.run(view, 'destroy');
      $('#qunit-fixture').removeClass('scrollable');
    }
  }
});

asyncTest('view calls controller\'s getMore', function(){
  expect(1);

  var InfiniteView = Ember.View.extend(
    Ember.InfiniteScroll.ViewMixin);
  var controller = Ember.Controller.createWithMixins({
    actions: {
      'infinite.getMore': function(){
        ok(true, 'calls infinite.getMore');
      }
    }
  });
  view = InfiniteView.create({controller: controller});
  Ember.run(function(){
    view.appendTo($('#qunit-fixture'));
    $(window).scrollTop($(document).height());
    start();
  });
});
