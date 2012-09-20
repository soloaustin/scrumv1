fs = require 'fs'
path = './script/views'
fs.readFile "#{path}/stories/sprint_backlog/map.js",'utf8', (error,data) ->
	console.log data
fs.readdir "#{path}/", (err, tables) ->
	crateView = (table) ->
		view = 
			_id : "_design/#{table}"
			language : "javascript"
			views : {}
		fs.readdir "#{path}/#{table}/" ,(err,ids) ->
			createMapReduce = (id) ->
				view.views[id] = {}
			createMapReduce id for id in ids
	crateView table for table in tables
	

	

