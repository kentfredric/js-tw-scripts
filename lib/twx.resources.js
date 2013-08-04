(function() {
  if ( !document['twx'] ) {
    document['twx'] = {};
  }
  if ( document.twx['resources'] ) {
    return;
  }
  var res = document.twx.resources = {};
  var trun_k = function(xnumber) {
    return Number.toInteger( xnumber / 1000 ) * 1000;
  };

  res.clay = function() {    return Number( $("#stone").text())   };
  res.wood = function() {    return Number( $("#wood").text() )   };
  res.iron = function() {    return Number( $("#iron").text() )   };
  res.pop_limit =       function() {  return Number($("#pop_max_label").text()    ) };
  res.pop_amount =      function() {  return Number($("#pop_current_label").text()) };
  res.warehouse_limit = function() {  return Number($("#storage").text()          ) };
  res.pop_free = function()  {    return res.pop_limit() - res.pop_amount()  };
  res.clay_free = function() {   return res.warehouse_limit() - res.clay()   };
  res.wood_free = function() {   return res.warehouse_limit() - res.wood()   };
  res.iron_free = function() {   return res.warehouse_limit() - res.iron()   };
  res.clay_approx = function() { return trun_k( res.clay() ) }
  res.wood_approx = function() { return trun_k( res.wood() ) }
  res.iron_approx = function() { return trun_k( res.iron() ) }

  res.clay_free_approx = function() {   return trun_k( res.clay_free() )   };
  res.wood_free_approx = function() {   return trun_k( res.wood_free() )   };
  res.iron_free_approx = function() {   return trun_k( res.iron_free() )   };
  
  res.resources = function() {
    return { wood: res.wood(), clay: res.clay(), iron: res.iron() }
  };
  res.resources_free = function() {
    return { wood: res.wood_free(), clay: res.clay_free(), iron: res.iron_free() }
  };
  res.resources_approx = function() {
    return { wood: res.wood_approx(), clay: res.clay_approx(), iron: res.iron_approx() }
  };
  res.resources_free_approx = function() {
    return { wood: res.wood_free_approx(), clay: res.clay_free_approx(), iron: res.iron_free_approx() }
  };

})();
