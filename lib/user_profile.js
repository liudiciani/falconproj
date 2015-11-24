var model = require('./user');

function result(success, message, uuid) {
	return {
		success: success,
		message: message,
		uuid: uuid
	};
}

function find(uuid){
	model.search(uuid, (err, data) => {
		if(err) {
		return null;
		} else {
			return data;
		}
	});
	return uuid;
}

function fetch(uuid) {
	if(typeof(uuid) != 'string'){
		return result(false, "Error: not a string. Usage: fetch(uuid) where uuid is the unique user id as a String", '');
	}
	var found = find(uuid); //found will be a *copy* of the users member object, because find returns a copy, not the original.
	if(found === null){
		return result(false, 'user not found', '');
	}
	return result(true, 'user found', found);
}

exports.fetch = fetch;