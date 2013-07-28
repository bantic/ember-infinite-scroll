== Ember Infinite Scroll Mixin

This repo contains a file `infinite_scroll.js` that adds a global
`InfiniteScroll` to `window` with several mixins (for Route, Controller
and View) that you can use to add infinite scrolling capability to your
ember project.

== Installation Instructions

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
 * Add and implement the methods `getMore` and `fetchPage` to the events appropriate route,
for example:
```
   App.SomeRoute = Ember.Route.extend({
     events: {
       getMore: function(){
         var controller = this.get('controller'),
             nextPage   = controller.get('page') + 1,
             perPage    = controller.get('perPage'),
             items;

         items = this.events.fetchPage(nextPage, perPage);
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
Default values are 25 and 1, respectively. Example change:
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

== Demo

See the jsbin here LINK for an demo app using the InfiniteScroll mixins.

== Feedback

Questions or comments? I am on twitter @bantic. Pull requests welcome.
