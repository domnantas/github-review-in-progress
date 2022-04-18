import express, {Express, Request, Response} from 'express';

const app: Express = express();

app.get('/', (request: Request, response: Response) => {
	response.send('<h1>Hello world</h1>');
});

app.listen(3000, () => {
	console.log('Server is running at http://localhost:3000');
});
