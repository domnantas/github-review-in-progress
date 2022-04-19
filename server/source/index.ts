import {Server} from 'socket.io';

const io = new Server({
	cors: {
		origin: 'https://github.com',
	},
});

interface View {
	username: string;
	prNumber: number;
}

const views: View[] = [];

io.on('connection', socket => {
	socket.on('view', ({username, prNumber}: View) => {
		views.push({username, prNumber});
		io.emit('view list', views);
	});

	socket.emit('view list', views);
});

io.listen(3000);
