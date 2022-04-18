import {Server} from 'socket.io';

const io = new Server({
	cors: {
		origin: 'https://github.com',
	},
});
io.on('connection', socket => {
	console.log('Client connected');

	socket.on('disconnect', () => {
		console.log('Client disconnected');
	});
});

io.listen(3000);
