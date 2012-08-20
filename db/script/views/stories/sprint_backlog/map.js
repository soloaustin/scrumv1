function(doc) {
  emit({project:doc.project_id,sprint:doc.sprint_id}, {desc:doc.desc,id:doc.backlog_id});
}