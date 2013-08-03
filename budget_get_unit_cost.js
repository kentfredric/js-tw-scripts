if ( !document['budgeting'] ) {
  document['budgeting'] = {};
}

(function(){ 
  var scrape_map = {
    "Spear fighter": "spear",
    "Swordsman": "sword",
    "Axeman": "axe",
    "Archer": "archer",
    "Scout": "scout",
    "Light cavalry": "lc",
    "Mounted archer":"ma",
    "Heavy cavalry":"hc",
    "Ram":"ram",
    "Catapult":"cat"
  };
  
  var format_name = function(value){
    if ( scrape_map[value] ) {
      return scrape_map[value];
    }
    return value;
  };

  var format_numeric = function(value) {
    return Number(value);
  };

  var format_time = function(value) {
    var time_parts = String(value).split(/:/);
    return ( Number(time_parts[0]) * 60 )
                  + Number(time_parts[1]) + 
                  ( Number(time_parts[2]) / 60 );

  };

  var recruit_cell_positions = [
    { name: 'name', format: format_name },
    { name: 'wood', format: format_numeric },
    { name: 'clay', format: format_numeric },
    { name: 'iron', format: format_numeric },
    { name: 'pop',  format: format_numeric },
    { name: 'time', format: format_time },
  ];

  var row_to_costs = function (row) {
    var info = {};
    $("td", row ).each(function( td_id, td ) {
      if ( !recruit_cell_positions[ td_id ] ) {
        return false;
      }
      var rules = recruit_cell_positions[ td_id ];
      info[ rules.name ] = rules.format( $(td).text().trim() );
    });
    return info;
  };

  var get_unit_costs = function() {
    var table = $("form#train_form table.vis");
    var intel = {  };

    var scrape_row = function(row_id, row ) {
      var row_intel = row_to_costs(row);
      intel[ row_intel.name ] = row_intel;
    };
    $("tr.row_a",table).each(scrape_row);
    $("tr.row_b",table).each(scrape_row);
    return intel;
  };

  var unit_costs = get_unit_costs();

  if ( !document['budgeting']['get_unit_cost'] ) {
    document['budgeting']['get_unit_cost'] = function(unit) {
      if ( !unit_costs[unit] ) {
        return false;
      }
      return unit_costs[unit];
    };
  }
})();
