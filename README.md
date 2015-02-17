## Demo

See the [jsbin here](http://jsbin.com/famer/1) for a live demo app using the InfiniteScroll mixins.

There is also a fully-functional example in the `example/` dir.

## Ember Infinite Scroll Mixin

This repo contains a file `infinite_scroll.js` that adds a global
`InfiniteScroll` to `window` with several mixins (for Route, Controller
and View) that you can use to add infinite scrolling capability to your
ember project.

## Installation Instructions

 * Download and include `infinite_scroll.js` to your project. Include it after jQuery and Ember have been loaded.  
 * Mix in `InfiniteScroll.ControllerMixin` into your controller:

```javascript
    App.SomeController = Ember.ArrayController.extend(
      InfiniteScroll.ControllerMixin,
      {
      // your code here //
      }
    );
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

* Mix in `InfiniteScroll.ViewMixin` into your view, and call the
`setupInfiniteScrollListener` and `teardownInfiniteScrollListener`
hooks:

```javascript
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

* Add a template to go with the view with `data-template-name` to match the view 
(e.g. `IndexView` matches the data-template-name `index`.
Note: the html class names `inf-scroll-outer-container` and `inf-scroll-inner-container` 
are important and are required by infinite_scroll to identify the scrolling viewport.
Specify the direction of the scrolling with the addition of 
a class to the `inf-scroll-outer-container`: either `horizontal` or `vertical` as appropriate.
```handlebars
  <script data-template-name="some" type="text/x-handlebars">
  <div class="inf-scroll-outer-container vertical">
    <ul class="inf-scroll-inner-container">
    {{#each widget in controller}}
      <li>
        // your code for each scroll item here
      </li>
    {{/each}}
    </ul>
  </div>
  </script>
```

* Add some appropriate styling.

```CSS
  .inf-scroll-outer-container.horizontal {
    overflow-x: scroll; /* <-- required for horizontal scrolling */
    white-space: nowrap; /* <-- required for horizontal scrolling; 
                                optional for vertical scrolling*/
    width: 200px; /* a set width is required for horizontal scrolling */
  }
  .inf-scroll-outer-container.horizontal > .inf-scroll-inner-container {
    display: inline; /* <--'display: inline' for horizontal scrolling 
                            or remove/comment out for vertical scrolling */
  }
  .inf-scroll-outer-container.horizontal > .inf-scroll-inner-container > * {
    display: inline-block; /* <--'display: block' for vertical scrolling 
                                  or either 'display: inline' or 'display: inline-block'
                                  for horizontal scrolling.*/
  }
  .inf-scroll-outer-container.vertical {
    overflow-y: scroll; /* <-- required for vertical scrolling */
    height: 200px; /* a set height is required for horizontal scrolling */
  }
  .inf-scroll-outer-container.vetical > .inf-scroll-inner-container > * {
    display: block;
  }
  .inf-scroll-inner-container {
    overflow: visible; /* <-- required to ensure inner container fully 
                              contains the scroll items */
  }
```

* Add and implement the methods `getMore` and `fetchPage`
 in the `actions` hash on the appropriate route, for example:

```javascript
  App.SomeRoute = Ember.Route.extend({
    actions: {
      getMore: function(){
        var controller = this.get('controller'),
           nextPage   = controller.get('page') + 1,
           perPage    = controller.get('perPage'),
           items;

        items = this.send('fetchPage', nextPage, perPage);
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
          this.get('controller').send('gotMore', items, page);
        */
      }
    }
  );
```

* If wanted, use the `loadingMore` property in your template to show a
spinner or otherwise alert the user that new content is loading. Example:

```handlebars
  {{#if loadingMore}}
    Loading more data (automatically!)
  {{else}}
    <a href='#' {{action 'getMore'}}>Load more data (manually)</a>
  {{/if}}
```


## Feedback

Questions or comments? I am on twitter @bantic. Pull requests welcome.
