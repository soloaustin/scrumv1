function(keys, values, reduce) {
	var todo = [],
		inProgress = [],
		done = [];
	var getItem = function(item) {
			return {
				id: item._id,
				name: item.name,
				type: item.type,
				assignTo: item.assignTo,
				status: item.status,
				story:item.story
			};
		}
	if (reduce) {
		for (index in values) {
			todo.concat(values.todo);
			inProgress.concat(values.inProgress);
			done.concat(values.done);
		}

	} else {
		for (index in values) {
			item = values[index];
			if (item.status == 'todo') {
				todo.push(getItem(item));
			}
			if (item.status == 'inProgress') {
				inProgress.push(getItem(item));
			}
			if (item.status == 'done') {
				done.push(getItem(item));
			}
		}
	}

	return {
		"todo": todo,
		"inProgress": inProgress,
		"done": done
	};
}