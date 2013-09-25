## Ember Infinite Scroll Mixin

This repo contains a file `infinite_scroll.js` that adds a global
`InfiniteScroll` to `window` with several mixins (for Route, Controller
and View) that you can use to add infinite scrolling capability to your
ember project.

## Installation Instructions

 * Download and include `infinite_scroll.js` to your project. Include it after jQuery and Ember have been loaded.  
 * Mix in `InfiniteScroll.ControllerMixin` into your controller:

```
    App.SomeController = Ember.ArrayController.extend(
      InfiniteScroll.ControllerMixin,
      {
      // your code here //
      }
    );
```

* Mix in `InfiniteScroll.ViewMixin` into your view, and call the
`setupInfiniteScrollListener` and `teardownInfiniteScrollListener`
hooks:

```
   App.SomeView = Ember.View.extend(
     InfiniteScroll.ViewMixin,
     {
       didInsertElement: function(){
         this.setupInfiniteScrollListener();
         // your code here
       },
       willDestroyElement: function(){
         this.teardownInfiniteScrollListener();
         // your code here
       }
     }
   );
```

* Add and implement the methods `getMore` and `fetchPage` in the `actions` hash on the appropriate route,
for example:

```
   App.SomeRoute = Ember.Route.extend({
     actions: {
       getMore: function(){
         var controller = this.get('controller'),
             nextPage   = controller.get('page') + 1,
             perPage    = controller.get('perPage'),
             items;

         items = this.actions.fetchPage(nextPage, perPage);
         controller.gotMore(items, nextPage);
       },

       // returns the array of fetched items
       fetchPage: function(page, perPage){
         // find items
         // fake example:
         /*
            var items = Em.A([]);
            var firstIndex = (page-1) * perPage;
            var lastIndex  = page * perPage;
            for (var i = firstIndex; i < lastIndex; i++) {
              items.pushObject({name:''+i});
            }

            return items;
         */
       }
     }
   });
```

* If necessary, set the `perPage` or initial `page` property on the controller.
Default values are 25 and 1, respectively. Here's an example changing those values:

```
  App.SomeController = Ember.ArrayController.extend(
    InfiniteScroll.ControllerMixin,
    {
      perPage: 50, // override the default and set to 50 per page
      page: 3, // assume we are starting on the 3rd page
      // your code here //
    }
  );
```

* If wanted, use the `loadingMore` property in your template to show a
spinner or otherwise alert the user that new content is loading. Example:

```
  {{#if loadingMore}}
    Loading more data (automatically!)
  {{else}}
    <a href='#' {{action 'getMore'}}>Load more data (manually)</a>
  {{/if}}
```

## Demo

See the [jsbin here](http://jsbin.com/epepob/4/edit) for a live demo app using the InfiniteScroll mixins.

There is also a fully-functional example in the `example/` dir.

All together, an example App using the mixins might look like this:

```
var App = Ember.Application.create();

// Define the Infinite Scroll route actions
// separately so it's easier to see what
// other actions the IndexRoute ends up using
App.InfiniteSrollRouteActions = {
  actions: {
      getMore: function(){
        var controller = this.get('controller'),
            nextPage   = controller.get('page') + 1,
            perPage    = controller.get('perPage'),
            items;
    
        items = this.actions.fetchPage(nextPage, perPage);
        controller.gotMore(items, nextPage);
      },
    
      fetchPage: function(page, perPage){
        var items = Em.A([]);
        var firstIndex = (page-1) * perPage;
        var lastIndex  = page * perPage;
        
        // create some fake items
        for (var i = firstIndex; i < lastIndex; i++) {
          items.pushObject({name:''+i});
        }
    
        return items;
      }
  }
};

App.IndexRoute = Ember.Route.extend({
  model: function(){
    var items = Em.A([]);
    // create some fake items
    for (var i = 0; i < 10; i++) {
      items.pushObject({name: ''+i});
    }
    return items;
  },
  actions: $.extend({},
    App.InfiniteScrollRouteActions,
    {
      // other non-infinite-scroll-specific route actions
      // can go here
    }
  )
});

App.IndexController = Ember.ArrayController.extend(
  InfiniteScroll.ControllerMixin,
  {
    // override InfiniteScroll's default `perPage` (optional)
    perPage: 10
  }
);

App.IndexView = Ember.View.extend(InfiniteScroll.ViewMixin, {
  didInsertElement: function(){
    this.setupInfiniteScrollListener();
  },
  willDestroyElement: function(){
    this.teardownInfiniteScrollListener();
  }
});
```

## Feedback

Questions or comments? I am on twitter @bantic. Pull requests welcome.
