{
   "_id": "_design/sprint_backlog",
   "_rev": "4-9e05265ce34efbb9ac4cacf852f549ec",
   "language": "javascript",
   "views": {
       "all": {
           "map": "function(doc) {\n  emit(doc.project_id, {desc:doc.desc,id:doc.backlog_id});\n}"
       }
   }
}