http = require('http')
options = 
	host:'127.0.0.1'
	port:5984
	
createTable = (table) ->
	options.path = "/#{table}"
	options.method = 'PUT'
	req = http.request options ,(res) ->
		console.log "headers: #{JSON.stringify res.headers}"
		res.setEncoding 'utf8'
		res.on 'data', (chunk) ->
			console.log "chunk: #{chunk}"
	req.on 'error',(e) ->
		console.log "error: #{e.message}"
	req.end()
createTable table for table in ["test_stories","test_tasks"]




