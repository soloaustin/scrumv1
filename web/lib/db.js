/*
* db.stories.sprintBacklog.all.query({})
*/

var db = function(){
	var $this = this;
	var server = "http://localhost:8125/db/";
	//var tables = {"stories":[],"tasks","projects"};
	_.each(tables,function(table){
		$this[table] = table;
	});
}