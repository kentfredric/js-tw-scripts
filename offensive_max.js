function smart_offensive() {

    var budget     = {
      wood: Number( $("#wood").text() ), 
      clay: Number($("#stone").text()), 
      iron: Number($("#iron").text()), 
      pop:  Number($("#pop_max_label").text()) - Number($("#pop_current_label").text())
    };

    var lc_in_time = function(t){ return t/( 4+ 10/60 ) };
    var axe_in_time = function(t){ return t/( 2+17/60 ) };
    var cost_lc = function(n){  
      return {
        wood: n * 125,
        clay: n * 100, 
        iron: n * 250,
        pop: n * 4 
      };
    };
    var cost_axe = function(n){
      return {
        wood: n * 60, 
        clay: n * 30, 
        iron: n * 40, 
        pop: n
      };
    };

    var can_afford = function(t) {
      var axes = axe_in_time(t);
      var lcs  = lc_in_time(t);
      var axe_cost = cost_axe(axes);
      var lc_cost  = cost_lc(lcs);
      if ( lc_cost.wood + axe_cost.wood  > budget.wood ) {
          return false;
      }
      if ( lc_cost.clay + axe_cost.clay > budget.clay ) {
          return false;
      }
      if ( lc_cost.iron + axe_cost.iron > budget.iron ) {
          return false;
      }
      if ( lc_cost.iron + axe_cost.iron > budget.iron ) {
          return false;
      }
      return {
        axes: Number.toInteger(axes), 
        lc  : Number.toInteger(lcs)
      };
  };

  var i = 1;
  var pi = i;

  while( can_afford(i) ) {
      pi = i;
      i = i * 2;
  }
  var si = pi;
  while( can_afford(pi) ) {
    si = pi;
    pi = pi + 1;
  }
  return can_afford(si);
}
function recruit_offensive() {
  var troops = smart_offensive();
}
