(function() {

  if ( !document['misc'] ) {
    document['misc'] = {}
  }

  if ( document.misc['localarray'] ) {
    //return;
  }


  document.misc.localarray = function( key , pool = 'localStorage' ) {

    var blob = {};


    blob.set = function(items) {
      window[pool].setItem(key, items.toSource());
    };

    blob.get = function() {
      if ( !window[pool][key] ) {
        blob.set([]);
      }
      return JSON.parse( window[pool].getItem(key) );
    };

    blob.push = function(item) { 
      var items = blob.get();
      items.push(item);
      blob.set(items);
    };

    blob.sort = function() {
      var items = blob.get();
      blob.set( items.sort() );
    };
    
    blob.delete_matching = function(matcher) {
      if ( !matcher ){
          throw "delete_matching(<matcher>) required."
      }
      var items = blob.get();
      items = items.reduce(function( carry, item, index ) {
        if ( ! matcher(index, item ) ) {
            carry.push(item);
        }
        return carry;
      }, []);
      blob.set(items)
    };
    blob.delete_at = function(i) {
      return blob.delete_matching(function(child_i,v) {
        return child_i == i;
      });
    };
    return blob;

  };

})();
