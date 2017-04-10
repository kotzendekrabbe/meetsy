var fs = require('fs');
var path = require('path');

module.exports = {
	getCurrentDirectoryBase : function() {
		return path.basename(process.cwd());
	},

	directoryExists : function(filePath) {
		try {
			return fs.statSync(filePath).isDirectory();
		} catch (err) {
			return false;
		}
	}
};