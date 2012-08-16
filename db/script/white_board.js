{
   "_id": "_design/board",
   "_rev": "15-0257a0cd2146d57fb8a749a0f6053bdf",
   "language": "javascript",
   "views": {
       "white_board": {
           "map": "function(doc) {\n  emit(doc.story, doc);\n}",
           "reduce": "function(keys, values, reduce) {\n\tvar todo = [],\n\t\tinProgress = [],\n\t\tdone = [];\n\tvar getItem = function(item) {\n\t\t\treturn {\n\t\t\t\tid: item._id,\n\t\t\t\tname: item.name,\n\t\t\t\ttype: item.type,\n\t\t\t\tassignTo: item.assignTo,\n\t\t\t\tstatus: item.status,\n\t\t\t\tstory:item.story\n\t\t\t};\n\t\t}\n\tif (reduce) {\n\t\tfor (index in values) {\n\t\t\ttodo.concat(values.todo);\n\t\t\tinProgress.concat(values.inProgress);\n\t\t\tdone.concat(values.done);\n\t\t}\n\n\t} else {\n\t\tfor (index in values) {\n\t\t\titem = values[index];\n\t\t\tif (item.status == 'todo') {\n\t\t\t\ttodo.push(getItem(item));\n\t\t\t}\n\t\t\tif (item.status == 'inProgress') {\n\t\t\t\tinProgress.push(getItem(item));\n\t\t\t}\n\t\t\tif (item.status == 'done') {\n\t\t\t\tdone.push(getItem(item));\n\t\t\t}\n\t\t}\n\t}\n\n\treturn {\n\t\t\"todo\": todo,\n\t\t\"inProgress\": inProgress,\n\t\t\"done\": done\n\t};\n}"
       }
   }
}