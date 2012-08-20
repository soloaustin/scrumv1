{
   "_id": "_design/sprint_backlog",
   "_rev": "1-bfa85e71a342118485a84113ed5a3dc5",
   "language": "javascript",
   "views": {
       "all": {
           "map": "function(doc) {\n  emit({project:doc.project_id,sprint:doc.sprint_id}, {desc:doc.desc,id:doc.backlog_id});\n}"
       }
   }
}