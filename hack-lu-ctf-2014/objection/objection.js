// Generated by LiveScript 1.3.1
var net, BufferStream, admin_password, server, slice$ = [].slice;
net = require('net');
BufferStream = require('bufferstream');
admin_password = require('fs').readFileSync('admin_password', 'utf8');
server = net.createServer(function(con){
	var client_context, in_stream;
	console.log('client connected');
	con.write('hello!\n');
	client_context = {
		is_admin: false,
		token: require('fs').readFileSync('secret_token', 'utf8'),
		login: function(arg$, cb){
			var password;
			password = arg$[0];
			if (password === admin_password) {
				cb("Authentication successful");
				return this.is_admin = true;
			} else {
				return cb("Authentication failed");
			}
		},
		get_token: function(arg$, cb){
			if (!this.is_admin) {
				return cb("You are not authorized to perform this action.");
			}
			return cb("The current token is " + this.token);
		}
	};
	in_stream = new BufferStream({
		encoding: 'utf8',
		size: 'flexible'
	});
	con.pipe(in_stream);
	return in_stream.split('\n', function(it){
		var ref$, funcname, args;
		it = it.toString('utf8');
		console.log("got line: " + it);
		ref$ = it.split(' ');
		funcname = ref$[0];
		args = slice$.call(ref$, 1);
		if (typeof client_context[funcname] !== 'function') {
			return con.write("error: unknown function " + funcname + "\n");
		}
		return client_context[funcname](args, function(it){
			return con.write(it + "\n");
		});
	});
});
server.listen(1408, function(){
	return console.log('server bound');
});
