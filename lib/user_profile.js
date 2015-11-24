var model = require('./user');

function result(success, message, uuid) {
	return {
		success: success,
		message: message,
		uuid: uuid
	};
}

function find(uuid){
	//right now this just echos back the uuid that was searched for.
	//TODO: make this search the database and return the entry
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